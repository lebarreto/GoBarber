import React, { useState, useMemo } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';
import en from 'date-fns/locale/en-US';
import { DatePickerIOS } from 'react-native';

import { Container, DateButton, DateText, Picker } from './styles';

export default function DateTimeInput({ date, onChange }) {
  const [opened, setOpened] = useState(false);

  const dateFormatted = useMemo(
    () => format(date, "MMMM dd ',' yyyy", { locale: en }),
    [date]
  );

  return (
    <Container>
      <DateButton onPress={() => setOpened(!opened)}>
        <Icon name="event" color="#fff" size={20} />
        <DateText>{dateFormatted}</DateText>
      </DateButton>

      {opened && (
        <Picker>
          <DatePickerIOS
            date={date}
            onDateChange={onChange}
            minimumDate={new Date()}
            minuteInterval={60}
            locale="en"
            mode="date"
          />
        </Picker>
      )}
    </Container>
  );
}
