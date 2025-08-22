/* import {
  SetErrorFunction,
  DefaultErrorFunction,
  ValueErrorType,
} from '@sinclair/typebox/errors'

SetErrorFunction((error) => {
  switch (error.errorType) {
    // Basic Types
    case ValueErrorType.String:
      return 'Harus berupa string'
    case ValueErrorType.Number:
      return 'Harus berupa angka'
    case ValueErrorType.Integer:
      return 'Harus berupa bilangan bulat'
    case ValueErrorType.BigInt:
      return 'Harus berupa BigInt'
    case ValueErrorType.Boolean:
      return 'Harus berupa boolean'
    case ValueErrorType.Object:
      return 'Harus berupa objek'
    case ValueErrorType.Array:
      return 'Harus berupa array'
    case ValueErrorType.Null:
      return 'Harus berupa null'
    case ValueErrorType.Undefined:
      return 'Harus berupa undefined'
    case ValueErrorType.Void:
      return 'Harus berupa void'
    case ValueErrorType.Date:
      return 'Harus berupa tanggal'
    case ValueErrorType.Function:
      return 'Harus berupa fungsi'
    case ValueErrorType.Promise:
      return 'Harus berupa Promise'
    case ValueErrorType.RegExp:
      return 'Harus berupa Regular Expression'
    case ValueErrorType.Symbol:
      return 'Harus berupa Symbol'
    case ValueErrorType.Uint8Array:
      return 'Harus berupa Uint8Array'
    case ValueErrorType.Iterator:
      return 'Harus berupa Iterator'
    case ValueErrorType.AsyncIterator:
      return 'Harus berupa AsyncIterator'

    // String Validations
    case ValueErrorType.StringMinLength:
      return 'String terlalu pendek'
    case ValueErrorType.StringMaxLength:
      return 'String terlalu panjang'
    case ValueErrorType.StringPattern:
      return 'Format string tidak valid'
    case ValueErrorType.StringFormat:
      return 'Format string tidak sesuai'
    case ValueErrorType.StringFormatUnknown:
      return 'Format string tidak dikenali'

    // Number Validations
    case ValueErrorType.NumberMinimum:
      return 'Angka terlalu kecil'
    case ValueErrorType.NumberMaximum:
      return 'Angka terlalu besar'
    case ValueErrorType.NumberExclusiveMinimum:
      return 'Angka harus lebih besar dari nilai minimum'
    case ValueErrorType.NumberExclusiveMaximum:
      return 'Angka harus lebih kecil dari nilai maksimum'
    case ValueErrorType.NumberMultipleOf:
      return 'Angka harus merupakan kelipatan dari nilai yang ditentukan'

    // Integer Validations
    case ValueErrorType.IntegerMinimum:
      return 'Bilangan bulat terlalu kecil'
    case ValueErrorType.IntegerMaximum:
      return 'Bilangan bulat terlalu besar'
    case ValueErrorType.IntegerExclusiveMinimum:
      return 'Bilangan bulat harus lebih besar dari nilai minimum'
    case ValueErrorType.IntegerExclusiveMaximum:
      return 'Bilangan bulat harus lebih kecil dari nilai maksimum'
    case ValueErrorType.IntegerMultipleOf:
      return 'Bilangan bulat harus merupakan kelipatan dari nilai yang ditentukan'

    // BigInt Validations
    case ValueErrorType.BigIntMinimum:
      return 'BigInt terlalu kecil'
    case ValueErrorType.BigIntMaximum:
      return 'BigInt terlalu besar'
    case ValueErrorType.BigIntExclusiveMinimum:
      return 'BigInt harus lebih besar dari nilai minimum'
    case ValueErrorType.BigIntExclusiveMaximum:
      return 'BigInt harus lebih kecil dari nilai maksimum'
    case ValueErrorType.BigIntMultipleOf:
      return 'BigInt harus merupakan kelipatan dari nilai yang ditentukan'

    // Array Validations
    case ValueErrorType.ArrayMinItems:
      return 'Array memiliki terlalu sedikit item'
    case ValueErrorType.ArrayMaxItems:
      return 'Array memiliki terlalu banyak item'
    case ValueErrorType.ArrayUniqueItems:
      return 'Array harus memiliki item yang unik'
    case ValueErrorType.ArrayContains:
      return 'Array tidak mengandung item yang diperlukan'
    case ValueErrorType.ArrayMinContains:
      return 'Array tidak memiliki cukup item yang sesuai'
    case ValueErrorType.ArrayMaxContains:
      return 'Array memiliki terlalu banyak item yang sesuai'

    // Object Validations
    case ValueErrorType.ObjectMinProperties:
      return 'Objek memiliki terlalu sedikit properti'
    case ValueErrorType.ObjectMaxProperties:
      return 'Objek memiliki terlalu banyak properti'
    case ValueErrorType.ObjectRequiredProperty:
      return 'Properti yang diperlukan tidak ada'
    case ValueErrorType.ObjectAdditionalProperties:
      return 'Objek memiliki properti tambahan yang tidak diizinkan'

    // Date Validations
    case ValueErrorType.DateMinimumTimestamp:
      return 'Tanggal terlalu lama'
    case ValueErrorType.DateMaximumTimestamp:
      return 'Tanggal terlalu baru'
    case ValueErrorType.DateExclusiveMinimumTimestamp:
      return 'Tanggal harus setelah tanggal minimum'
    case ValueErrorType.DateExclusiveMaximumTimestamp:
      return 'Tanggal harus sebelum tanggal maksimum'
    case ValueErrorType.DateMultipleOfTimestamp:
      return 'Timestamp tanggal harus merupakan kelipatan dari nilai yang ditentukan'

    // Uint8Array Validations
    case ValueErrorType.Uint8ArrayMinByteLength:
      return 'Uint8Array terlalu pendek'
    case ValueErrorType.Uint8ArrayMaxByteLength:
      return 'Uint8Array terlalu panjang'

    // Tuple Validations
    case ValueErrorType.Tuple:
      return 'Harus berupa tuple'
    case ValueErrorType.TupleLength:
      return 'Panjang tuple tidak sesuai'

    // Advanced Types
    case ValueErrorType.Union:
      return 'Nilai tidak cocok dengan salah satu tipe yang diizinkan'
    case ValueErrorType.Intersect:
      return 'Nilai tidak memenuhi semua tipe yang diperlukan'
    case ValueErrorType.IntersectUnevaluatedProperties:
      return 'Properti intersect tidak dapat dievaluasi'
    case ValueErrorType.Literal:
      return 'Nilai harus sama persis dengan literal yang ditentukan'
    case ValueErrorType.Never:
      return 'Tipe ini tidak boleh memiliki nilai'
    case ValueErrorType.Not:
      return 'Nilai tidak boleh sesuai dengan tipe yang ditentukan'
    case ValueErrorType.Kind:
      return 'Jenis tipe tidak valid'

    default:
      return DefaultErrorFunction(error)
  }
})
 */
