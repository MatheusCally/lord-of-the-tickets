import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  Platform, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'; // Usado apenas no nativo
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { fileToBase64 } from '../utils/base64'; // Importar helper

const AddTicketScreen = ({ navigation }) => {
  const [eventName, setEventName] = useState('');
  const [eventLocal, setEventLocal] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pdfAsset, setPdfAsset] = useState(null); // Armazena o asset do DocumentPicker

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || eventDate;
    setShowDatePicker(Platform.OS === 'ios'); // Comportamento padrão para fechar ou manter aberto
     if (event.type === "set" || Platform.OS !== 'ios') { // No Android e Web, atualiza e fecha
        setShowDatePicker(false);
        setEventDate(currentDate);
    } else if (event.type === "set") { // iOS, apenas atualiza
        setEventDate(currentDate);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: Platform.OS !== 'web', // Copiar para cache apenas no nativo
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPdfAsset(result.assets[0]);
      } else if (!result.canceled) {
        Alert.alert('Aviso', 'Nenhum arquivo PDF foi selecionado ou o formato é inválido.');
      }
    } catch (error) {
      console.error('Erro ao selecionar documento:', error);
      Alert.alert('Erro', 'Não foi possível selecionar o PDF.');
    }
  };

  const saveTicket = async () => {
    if (!eventName.trim() || !eventLocal.trim() || !pdfAsset) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos e selecione o PDF.');
      return;
    }

    try {
      let newTicketPayload = {
        id: Date.now().toString(),
        eventName,
        eventLocal,
        eventDate: eventDate.toISOString(),
        pdfOriginalName: pdfAsset.name,
      };

      if (Platform.OS === 'web') {
        if (!pdfAsset.file) {
            Alert.alert('Erro', 'Objeto de arquivo PDF não encontrado para web.');
            return;
        }
        const base64 = await fileToBase64(pdfAsset.file);
        newTicketPayload.pdfBase64 = base64;
        newTicketPayload.platform = 'web';
      } else {
        // Lógica nativa para copiar arquivo
        const pdfDir = FileSystem.documentDirectory + 'tickets_pdf/';
        const dirInfo = await FileSystem.getInfoAsync(pdfDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(pdfDir, { intermediates: true });
        }
        const fileName = `${Date.now()}_${pdfAsset.name.replace(/[^a-zA-Z0-9.]/g, '_')}`; // Nome de arquivo seguro
        const newPdfPath = pdfDir + fileName;
        await FileSystem.copyAsync({
          from: pdfAsset.uri,
          to: newPdfPath,
        });
        newTicketPayload.pdfUri = newPdfPath;
        newTicketPayload.platform = 'native';
      }

      const storedTickets = await AsyncStorage.getItem('tickets');
      const tickets = storedTickets ? JSON.parse(storedTickets) : [];
      tickets.push(newTicketPayload);
      await AsyncStorage.setItem('tickets', JSON.stringify(tickets));

      Alert.alert('Sucesso', 'Ingresso salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar ingresso:', error);
      Alert.alert('Erro', `Não foi possível salvar o ingresso. ${error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome do Evento:</Text>
      <TextInput
        style={styles.input}
        value={eventName}
        onChangeText={setEventName}
        placeholder="Ex: Show da Banda X"
      />

      <Text style={styles.label}>Local do Evento:</Text>
      <TextInput
        style={styles.input}
        value={eventLocal}
        onChangeText={setEventLocal}
        placeholder="Ex: Estádio Y"
      />

      <Text style={styles.label}>Data do Evento:</Text>
      {Platform.OS === 'web' ? (
        <input
            type="date"
            value={eventDate.toISOString().split('T')[0]} // Formato YYYY-MM-DD
            onChange={(e) => {
                if (e.target.value) {
                    const [year, month, day] = e.target.value.split('-').map(Number);
                    // Ajusta para UTC para evitar problemas de fuso horário com new Date()
                    setEventDate(new Date(Date.UTC(year, month - 1, day)));
                }
            }}
            style={styles.dateInputWeb}
        />
      ) : (
        <>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                <AntDesign name="calendar" size={20} color="#007AFF" />
                <Text style={styles.dateButtonText}>
                {eventDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                value={eventDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date(new Date().setDate(new Date().getDate() -1))} // Permite selecionar o dia de hoje
                />
            )}
        </>
      )}


      <Text style={styles.label}>PDF do Ingresso:</Text>
      <TouchableOpacity onPress={pickDocument} style={styles.uploadButton}>
        <MaterialIcons name="attach-file" size={22} color="#007AFF" />
        <Text style={styles.uploadButtonText}>
          {pdfAsset ? pdfAsset.name : 'Selecionar PDF'}
        </Text>
      </TouchableOpacity>
      {pdfAsset && pdfAsset.size && (
        <Text style={styles.pdfInfo}>
          Tamanho: {(pdfAsset.size / 1024 / 1024).toFixed(2)} MB
        </Text>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={saveTicket}>
        <Text style={styles.saveButtonText}>Salvar Ingresso</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  dateButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#007AFF',
  },
  dateInputWeb: { // Estilo para o input de data na web
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10, // Ajuste o padding conforme necessário
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', // Tenta usar fontes de sistema para melhor aparência
    height: 48, // Para alinhar com outros inputs
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  pdfInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddTicketScreen;