import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system'; // Usado apenas no nativo
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { base64ToBlob } from '../utils/base64'; // Importar helper

const TicketDetailsScreen = ({ route }) => {
  const { ticketId } = route.params;
  const [ticket, setTicket] = useState(null);

  const loadTicketDetails = useCallback(async () => {
    try {
      const storedTickets = await AsyncStorage.getItem('tickets');
      if (storedTickets) {
        const ticketsArray = JSON.parse(storedTickets);
        const currentTicket = ticketsArray.find(t => t.id === ticketId);
        if (currentTicket) {
          setTicket(currentTicket);
        } else {
          Alert.alert('Erro', 'Ingresso não encontrado.');
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do ingresso.');
      console.error("Erro ao carregar detalhes:", error);
    }
  }, [ticketId]);

  useEffect(() => {
    loadTicketDetails();
  }, [loadTicketDetails]);


  const openOrDownloadPdf = async () => {
    if (!ticket) return;

    if (Platform.OS === 'web') {
      if (ticket.pdfBase64) {
        try {
          const blob = base64ToBlob(ticket.pdfBase64);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = ticket.pdfOriginalName || 'ingresso.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error('Erro ao tentar baixar PDF:', e);
          Alert.alert('Erro', 'Não foi possível preparar o PDF para download.');
        }
      } else {
        Alert.alert('Erro', 'Conteúdo do PDF não encontrado para este ingresso na web.');
      }
    } else { // Nativo (iOS/Android)
      if (!ticket.pdfUri) {
        Alert.alert('Erro', 'Caminho do PDF não encontrado para este ingresso.');
        return;
      }
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Indisponível', 'O compartilhamento/abertura de arquivos não está disponível no seu dispositivo.');
        return;
      }
      try {
        const fileInfo = await FileSystem.getInfoAsync(ticket.pdfUri);
        if (!fileInfo.exists) {
          Alert.alert('Erro', 'Arquivo PDF não encontrado. Pode ter sido movido ou excluído.');
          return;
        }
        await Sharing.shareAsync(ticket.pdfUri, {
          mimeType: 'application/pdf',
          dialogTitle: `Abrir ${ticket.pdfOriginalName || 'ingresso'} com...`,
          UTI: 'com.adobe.pdf',
        });
      } catch (error) {
        console.error('Erro ao abrir PDF no nativo:', error);
        Alert.alert('Erro', 'Não foi possível abrir o arquivo PDF.');
      }
    }
  };

  if (!ticket) {
    return (
      <View style={styles.containerCenter}>
        <Text>Carregando detalhes do ingresso...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="ticket-confirmation-outline" size={30} color="#007AFF" />
          <Text style={styles.eventName}>{ticket.eventName}</Text>
        </View>

        <View style={styles.detailItem}>
          <Entypo name="location-pin" size={20} color="#555" style={styles.icon} />
          <Text style={styles.label}>Local:</Text>
          <Text style={styles.value}>{ticket.eventLocal}</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#555" style={styles.icon} />
          <Text style={styles.label}>Data:</Text>
          <Text style={styles.value}>
            {new Date(ticket.eventDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
          </Text>
        </View>

        <View style={styles.detailItem}>
           <MaterialCommunityIcons name="file-pdf-box" size={20} color="#555" style={styles.icon} />
          <Text style={styles.label}>Ingresso PDF:</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="middle">
            {ticket.pdfOriginalName || 'arquivo.pdf'}
          </Text>
        </View>

        <TouchableOpacity style={styles.openPdfButton} onPress={openOrDownloadPdf}>
          <MaterialCommunityIcons name={Platform.OS === 'web' ? "download-outline" : "script-text-play-outline"} size={22} color="white" />
          <Text style={styles.openPdfButtonText}>
            {Platform.OS === 'web' ? 'Baixar Ingresso (PDF)' : 'Abrir Ingresso (PDF)'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
    marginBottom: 15,
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    flexShrink: 1,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
    marginRight: 8,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
  openPdfButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  openPdfButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default TicketDetailsScreen;