import * as Contacts from 'expo-contacts';
import { useEffect, useState } from 'react';

const useContactBirthdays = () => {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [birthdays, setBirthdays] = useState<Contacts.Contact[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission denied');
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Birthday, Contacts.Fields.Name],
      });

      setContacts(data);

      const birthdayContacts = data.filter(contact => contact.birthday);
      setBirthdays(birthdayContacts);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  return { contacts, birthdays, error, refreshContacts: getContacts };
};

export default useContactBirthdays;