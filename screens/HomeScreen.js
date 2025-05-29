import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

const HomeScreen = ({ navigation }) => {
  const [tickets, setTickets] = useState([]);

  const loadTickets = useCallback(async () => {
    try {
      const storedTickets = await AsyncStorage.getItem('tickets');
      if (storedTickets !== null) {
        const parsedTickets = JSON.parse(storedTickets);
        parsedTickets.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        setTickets(parsedTickets);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error('Erro ao carregar ingressos:', error);
      // Evitar Alert aqui para não interferir com outros possíveis Alertas
      // Alert.alert('Erro', 'Não foi possível carregar os ingressos.');
      setTickets([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTickets();
    }, [loadTickets])
  );

  const handleDeleteTicket = async (ticketId, ticketPlatform, pdfUriToDelete) => {
    const proceedWithDeletion = async () => {
      try {
        const storedTicketsRaw = await AsyncStorage.getItem('tickets');
        let currentStoredTickets = storedTicketsRaw ? JSON.parse(storedTicketsRaw) : [];
        const updatedTicketsFromStorage = currentStoredTickets.filter(ticket => ticket.id !== ticketId);
        await AsyncStorage.setItem('tickets', JSON.stringify(updatedTicketsFromStorage));

        updatedTicketsFromStorage.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        setTickets(updatedTicketsFromStorage);

        if (ticketPlatform === 'native' && pdfUriToDelete) {
          try {
            await FileSystem.deleteAsync(pdfUriToDelete);
            console.log('Arquivo PDF nativo excluído com sucesso:', pdfUriToDelete);
          } catch (fileError) {
            console.warn('Erro ao excluir arquivo PDF físico (nativo):', fileError);
          }
        }

        // Usar Alert para sucesso é geralmente seguro em todas as plataformas após a ação
        Alert.alert('Sucesso', 'Ingresso excluído com sucesso.');

      } catch (error) {
        console.error('Erro ao excluir ingresso:', error);
        Alert.alert('Erro', 'Não foi possível excluir o ingresso.');
      }
    };

    // Lógica de confirmação específica da plataforma
    if (Platform.OS === 'web') {
      // Usar window.confirm para a web, que é mais confiável para um simples sim/não
      if (window.confirm("Você tem certeza que deseja excluir este ingresso? Esta ação não pode ser desfeita.")) {
        proceedWithDeletion();
      }
    } else {
      // Manter Alert.alert para nativo (iOS/Android)
      Alert.alert(
        "Confirmar Exclusão",
        "Você tem certeza que deseja excluir este ingresso? Esta ação não pode ser desfeita.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            onPress: proceedWithDeletion,
            style: "destructive"
          }
        ],
        { cancelable: true }
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.ticketItemContainer}>
      <TouchableOpacity
        style={styles.ticketTouchable}
        onPress={() => navigation.navigate('TicketDetails', { ticketId: item.id })}
      >
        <View style={styles.ticketInfo}>
          <Text style={styles.eventName}>{item.eventName}</Text>
          <Text style={styles.eventDate}>
            {new Date(item.eventDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} - {item.eventLocal}
          </Text>
        </View>
        <AntDesign name="right" size={20} color="#ccc" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTicket(item.id, item.platform, item.pdfUri)}
      >
        <MaterialIcons name="delete-forever" size={28} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  // O restante do componente (FlatList, addButton, styles) permanece o mesmo...
  return (
    <View style={styles.container}>
      {tickets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum ingresso cadastrado.</Text>
          <Text style={styles.emptySubText}>Clique no botão "+" para adicionar seu primeiro ingresso!</Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTicket')}
      >
        <AntDesign name="plus" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  list: {
    padding: 10,
  },
  ticketItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  ticketTouchable: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 15,
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticketInfo: {
    flex: 1,
    marginRight: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  deleteButton: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: Platform.OS === 'web' ? 1000 : undefined,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  }
});

export default HomeScreen;