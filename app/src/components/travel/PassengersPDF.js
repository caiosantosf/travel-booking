import React from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import { dateTimeBrazil } from '../../config/util'

const styles = StyleSheet.create({
  table: { 
    display: "table", 
    width: "auto", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0,
    margin: 10
  }, 
  
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  }, 

  tableColSmall: { 
    width: "13%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  },

  tableColBig: { 
    width: "60%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  },

  tableCell: { 
    margin: "auto", 
    marginTop: 5, 
    fontSize: 10 
  },

  title: {
    margin: 10
  }
})

function PassengersPDF({ passengers, travel, departurePlaces }) {

  return (
    <Document>
      <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{`${travel.destination} - ${dateTimeBrazil(departurePlaces[0].departureDate)}`}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}> 
          <View style={styles.tableColSmall}> 
            <Text style={styles.tableCell}>P. Ida</Text> 
          </View> 
          <View style={styles.tableColSmall}> 
            <Text style={styles.tableCell}>P. Volta</Text> 
          </View>
          <View style={styles.tableColBig}> 
            <Text style={styles.tableCell}>Nome</Text> 
          </View> 
          <View style={styles.tableColSmall}> 
            <Text style={styles.tableCell}>Colo</Text> 
          </View>
        </View>

        {passengers.map(passenger => {
          const { id, person, departureSeat, returnSeat, lapChild } = passenger
          const { name } = person

          if ((departureSeat || returnSeat) || lapChild) {
            return (
              <View key={id} style={styles.tableRow}> 
                <View style={styles.tableColSmall}> 
                  <Text style={styles.tableCell}>{departureSeat}</Text> 
                </View> 
                <View style={styles.tableColSmall}> 
                  <Text style={styles.tableCell}>{returnSeat}</Text> 
                </View> 
                <View style={styles.tableColBig}> 
                  <Text style={styles.tableCell}>{name}</Text>
                </View> 
                <View style={styles.tableColSmall}> 
                  <Text style={styles.tableCell}>{lapChild ? 'Sim' : 'Não'}</Text> 
                </View> 
              </View>
            )
          } else {
            return (null)
          }
        })}
      </View>

      </Page>
    </Document>
)}

export default PassengersPDF