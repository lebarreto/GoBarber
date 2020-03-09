import React, { useMemo } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';
import en from 'date-fns/locale/en-US';
import { DatePickerAndroid } from 'react-native';

import { Container, DateButton, DateText } from './styles';

export default function DateTimeInput({ date, onChange }) {
  const dateFormatted = useMemo(
    () => format(date, "MMMM dd ',' yyyy", { locale: en }),
    [date]
  );

  async function handleOpenPicker() {
    const { action, year, month, day } = await DatePickerAndroid.open({
      mode: 'spinner',
      date,
    });

    if (action === DatePickerAndroid.dateSetAction) {
      const selectedDate = new Date(year, month, day);

      onChange(selectedDate);
    }
  }

  return (
    <Container>
      <DateButton onPress={handleOpenPicker}>
        <Icon name="event" color="#fff" size={20} />
        <DateText>{dateFormatted}</DateText>
      </DateButton>
    </Container>
  );
}
