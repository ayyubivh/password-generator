import { useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { SafeAreaView } from 'react-native-safe-area-context'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import Clipboard from '@react-native-clipboard/clipboard'

const PasswordSchema = Yup.object().shape({
  PasswordLength: Yup.number()
    .min(4, 'Password must be at least 4 characters long')
    .max(16, 'Password cannot exceed 16 characters')
    .required('Password is required'),
})

function App() {
  const [password, setPassword] = useState('')
  const [isPassGenerated, setIsPassGenerated] = useState(false)

  const [lowerCase, setLowerCase] = useState(false)
  const [upperCase, setUpperCase] = useState(false)
  const [numbers, setNumbers] = useState(false)
  const [symbols, setSymbols] = useState(false)

  const generatePasswordString = (passwordLength: number) => {
    let characterList = ''

    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const digitChars = '0123456789'
    const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-='

    if (upperCase) {
      characterList += upperCaseChars
    }

    if (lowerCase) {
      characterList += lowerCaseChars
    }

    if (numbers) {
      characterList += digitChars
    }

    if (symbols) {
      characterList += specialChars
    }

    if (characterList.length === 0) {
      console.log('Please select at least one character type')
      return
    }

    const passwordResult = createPassword(
      characterList,
      passwordLength
    )

    setPassword(passwordResult)
    setIsPassGenerated(true)
  }

  const createPassword = (
    characters: string,
    passwordLength: number
  ) => {
    let result = ''

    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.floor(
        Math.random() * characters.length
      )

      console.log('character index:', characterIndex)

      result += characters.charAt(characterIndex)
    }

    return result
  }

  const resetPasswordState = () => {
    setIsPassGenerated(false)
    setPassword('')
    setLowerCase(false)
    setUpperCase(false)
    setNumbers(false)
    setSymbols(false)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.formContainer}
      >
        <Text style={styles.title}>
          Password Generator
        </Text>

        <Formik
          initialValues={{
            PasswordLength: '',
          }}
          validationSchema={PasswordSchema}
          onSubmit={(values) => {
            console.log('SUBMITTED:', values)

            generatePasswordString(
              Number(values.PasswordLength)
            )
          }}
        >
          {({
            values,
            errors,
            touched,
            isValid,
            handleChange,
            handleSubmit,
            handleReset,
          }) => (
            <>
              {/* Password Length */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputColumn}>
                  <Text style={styles.heading}>
                    Password Length
                  </Text>

                  {touched.PasswordLength &&
                    errors.PasswordLength && (
                      <Text style={styles.errorText}>
                        {errors.PasswordLength}
                      </Text>
                    )}
                </View>

                <TextInput
                  style={styles.input}
                  value={values.PasswordLength}
                  onChangeText={handleChange('PasswordLength')}
                  placeholder="Ex. 8"
                  keyboardType="numeric"
                />
              </View>

              {/* Lowercase */}
              <View style={styles.inputWrapper}>
                <Text style={styles.optionText}>
                  Include Lowercase
                </Text>

                <BouncyCheckbox
                  isChecked={lowerCase}
                  onPress={() =>
                    setLowerCase(!lowerCase)
                  }
                  fillColor="#29AB87"
                />
              </View>

              {/* Uppercase */}
              <View style={styles.inputWrapper}>
                <Text style={styles.optionText}>
                  Include Uppercase Letters
                </Text>

                <BouncyCheckbox
                  isChecked={upperCase}
                  onPress={() =>
                    setUpperCase(!upperCase)
                  }
                  fillColor="#D94F70"
                />
              </View>

              {/* Symbols */}
              <View style={styles.inputWrapper}>
                <Text style={styles.optionText}>
                  Include Symbols
                </Text>

                <BouncyCheckbox
                  isChecked={symbols}
                  onPress={() =>
                    setSymbols(!symbols)
                  }
                  fillColor="#E67E4A"
                />
              </View>

              {/* Numbers */}
              <View style={styles.inputWrapper}>
                <Text style={styles.optionText}>
                  Include Numbers
                </Text>

                <BouncyCheckbox
                  isChecked={numbers}
                  onPress={() =>
                    setNumbers(!numbers)
                  }
                  fillColor="#4285A4"
                />
              </View>

              {/* Buttons */}
              <View style={styles.formActions}>
                <TouchableOpacity
                  disabled={
                    !isValid ||
                    !values.PasswordLength
                  }
                  onPress={() => handleSubmit()}
                  style={[
                    styles.primaryBtn,
                    (!isValid ||
                      !values.PasswordLength) &&
                      styles.disabledBtn,
                  ]}
                >
                  <Text style={styles.primaryBtnTxt}>
                    Generate Password
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => {
                    handleReset()
                    resetPasswordState()
                  }}
                >
                  <Text style={styles.secondaryBtnTxt}>
                    Reset
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>

        {/* Generated Password */}
        {isPassGenerated && (
          <Pressable
          onLongPress={()=>{
            Clipboard.setString(password)
          }}
          >
            <View style={styles.passwordContainer}>
            <Text style={styles.passwordTitle}>
              Generated Password
            </Text>

            <View style={styles.passwordRow}>
            <Text style={styles.passwordText}>
              {password}
            </Text>
            <Text style={styles.copyText}>
              Long press to copy
            </Text>
            </View>
          </View>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  formContainer: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  inputColumn: {
    flex: 1,
  },

  input: {
    width: 100,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
  },

  heading: {
    fontSize: 16,
  },

  optionText: {
    fontSize: 16,
  },

  errorText: {
    color: 'red',
    marginTop: 5,
  },

  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },

  primaryBtn: {
    backgroundColor: '#29AB87',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  disabledBtn: {
    opacity: 0.5,
  },

  primaryBtnTxt: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  secondaryBtn: {
    backgroundColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  secondaryBtnTxt: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },

  passwordContainer: {
    marginTop: 40,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#29AB87',
  },

  passwordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  passwordText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#29AB87',
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  copyText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 15,
  },
})

export default App