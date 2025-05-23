import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const CustomDropdown = ({
  valueItem,
  onChange,
  options,
  label,
  placeholder,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (valueItem || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: '#4fc87a' }]}>
          {label}
        </Text>
      );
    }
    return null;
  };
  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: '#4fc87a' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={options}
        search={false}
        maxHeight={400}
        activeColor="rgba(79, 200, 122, 0.5)"
        itemContainerStyle={{ borderRadius: 8, margin: 5 }}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholder : '...'}
        value={valueItem}
        containerStyle={{ borderRadius: 8 }}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onChange(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <MaterialCommunityIcons
            style={styles.icon}
            color={isFocus ? '#4fc87a' : 'black'}
            name="sort-variant"
            size={20}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dropdown: {
    height: 50,
    borderColor: '#4fc87a',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 2,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
