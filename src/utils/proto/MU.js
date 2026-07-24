export function encodeMU(message) {
  let bb = popByteBuffer()
  _encodeMU(message, bb)
  return toUint8Array(bb)
}

function _encodeMU(message, bb) {
  // optional bytes MessageType = 1;
  let $MessageType = message.MessageType
  if ($MessageType !== undefined) {
    writeVarint32(bb, 10)
    writeVarint32(bb, $MessageType.length), writeBytes(bb, $MessageType)
  }

  // optional double T = 2;
  let $T = message.T
  if ($T !== undefined) {
    writeVarint32(bb, 17)
    writeDouble(bb, $T)
  }

  // optional int32 Id = 3;
  let $Id = message.Id
  if ($Id !== undefined) {
    writeVarint32(bb, 24)
    writeVarint64(bb, intToLong($Id))
  }

  // optional bytes disID = 4;
  let $disID = message.disID
  if ($disID !== undefined) {
    writeVarint32(bb, 34)
    writeVarint32(bb, $disID.length), writeBytes(bb, $disID)
  }

  // optional bytes entityID = 5;
  let $entityID = message.entityID
  if ($entityID !== undefined) {
    writeVarint32(bb, 42)
    writeVarint32(bb, $entityID.length), writeBytes(bb, $entityID)
  }

  // optional bytes Name = 6;
  let $Name = message.Name
  if ($Name !== undefined) {
    writeVarint32(bb, 50)
    writeVarint32(bb, $Name.length), writeBytes(bb, $Name)
  }

  // optional bytes Type = 7;
  let $Type = message.Type
  if ($Type !== undefined) {
    writeVarint32(bb, 58)
    writeVarint32(bb, $Type.length), writeBytes(bb, $Type)
  }

  // optional bytes Side = 8;
  let $Side = message.Side
  if ($Side !== undefined) {
    writeVarint32(bb, 66)
    writeVarint32(bb, $Side.length), writeBytes(bb, $Side)
  }

  // optional int64 Index = 9;
  let $Index = message.Index
  if ($Index !== undefined) {
    writeVarint32(bb, 72)
    writeVarint64(bb, $Index)
  }

  // optional double Lon = 10;
  let $Lon = message.Lon
  if ($Lon !== undefined) {
    writeVarint32(bb, 81)
    writeDouble(bb, $Lon)
  }

  // optional double Lat = 11;
  let $Lat = message.Lat
  if ($Lat !== undefined) {
    writeVarint32(bb, 89)
    writeDouble(bb, $Lat)
  }

  // optional double Alt = 12;
  let $Alt = message.Alt
  if ($Alt !== undefined) {
    writeVarint32(bb, 97)
    writeDouble(bb, $Alt)
  }

  // optional double HDG = 13;
  let $HDG = message.HDG
  if ($HDG !== undefined) {
    writeVarint32(bb, 105)
    writeDouble(bb, $HDG)
  }

  // optional double Pitch = 14;
  let $Pitch = message.Pitch
  if ($Pitch !== undefined) {
    writeVarint32(bb, 113)
    writeDouble(bb, $Pitch)
  }

  // optional double Roll = 15;
  let $Roll = message.Roll
  if ($Roll !== undefined) {
    writeVarint32(bb, 121)
    writeDouble(bb, $Roll)
  }

  // optional double SPD = 16;
  let $SPD = message.SPD
  if ($SPD !== undefined) {
    writeVarint32(bb, 129)
    writeDouble(bb, $SPD)
  }

  // optional double SpeedNED0 = 17;
  let $SpeedNED0 = message.SpeedNED0
  if ($SpeedNED0 !== undefined) {
    writeVarint32(bb, 137)
    writeDouble(bb, $SpeedNED0)
  }

  // optional double SpeedNED1 = 18;
  let $SpeedNED1 = message.SpeedNED1
  if ($SpeedNED1 !== undefined) {
    writeVarint32(bb, 145)
    writeDouble(bb, $SpeedNED1)
  }

  // optional double SpeedNED2 = 19;
  let $SpeedNED2 = message.SpeedNED2
  if ($SpeedNED2 !== undefined) {
    writeVarint32(bb, 153)
    writeDouble(bb, $SpeedNED2)
  }

  // optional double AccelNED0 = 20;
  let $AccelNED0 = message.AccelNED0
  if ($AccelNED0 !== undefined) {
    writeVarint32(bb, 161)
    writeDouble(bb, $AccelNED0)
  }

  // optional double AccelNED1 = 21;
  let $AccelNED1 = message.AccelNED1
  if ($AccelNED1 !== undefined) {
    writeVarint32(bb, 169)
    writeDouble(bb, $AccelNED1)
  }

  // optional double AccelNED2 = 22;
  let $AccelNED2 = message.AccelNED2
  if ($AccelNED2 !== undefined) {
    writeVarint32(bb, 177)
    writeDouble(bb, $AccelNED2)
  }

  // optional double FuelQ = 23;
  let $FuelQ = message.FuelQ
  if ($FuelQ !== undefined) {
    writeVarint32(bb, 185)
    writeDouble(bb, $FuelQ)
  }

  // optional double FuelCRate = 24;
  let $FuelCRate = message.FuelCRate
  if ($FuelCRate !== undefined) {
    writeVarint32(bb, 193)
    writeDouble(bb, $FuelCRate)
  }

  // repeated Weapon Weapons = 25;
  let array$Weapons = message.Weapons
  if (array$Weapons !== undefined) {
    for (let value of array$Weapons) {
      writeVarint32(bb, 202)
      let nested = popByteBuffer()
      _encodeWeapon(value, nested)
      writeVarint32(bb, nested.limit)
      writeByteBuffer(bb, nested)
      pushByteBuffer(nested)
    }
  }

  // optional double TAS = 26;
  let $TAS = message.TAS
  if ($TAS !== undefined) {
    writeVarint32(bb, 209)
    writeDouble(bb, $TAS)
  }

  // optional double CAS = 27;
  let $CAS = message.CAS
  if ($CAS !== undefined) {
    writeVarint32(bb, 217)
    writeDouble(bb, $CAS)
  }

  // optional double IAS = 28;
  let $IAS = message.IAS
  if ($IAS !== undefined) {
    writeVarint32(bb, 225)
    writeDouble(bb, $IAS)
  }

  // optional double M = 29;
  let $M = message.M
  if ($M !== undefined) {
    writeVarint32(bb, 233)
    writeDouble(bb, $M)
  }

  // optional double AGL = 30;
  let $AGL = message.AGL
  if ($AGL !== undefined) {
    writeVarint32(bb, 241)
    writeDouble(bb, $AGL)
  }

  // optional double AOA = 31;
  let $AOA = message.AOA
  if ($AOA !== undefined) {
    writeVarint32(bb, 249)
    writeDouble(bb, $AOA)
  }

  // optional double SSA = 32;
  let $SSA = message.SSA
  if ($SSA !== undefined) {
    writeVarint32(bb, 257)
    writeDouble(bb, $SSA)
  }

  // optional double RRT = 33;
  let $RRT = message.RRT
  if ($RRT !== undefined) {
    writeVarint32(bb, 265)
    writeDouble(bb, $RRT)
  }

  // optional double TRT = 34;
  let $TRT = message.TRT
  if ($TRT !== undefined) {
    writeVarint32(bb, 273)
    writeDouble(bb, $TRT)
  }

  // optional double FUEL = 35;
  let $FUEL = message.FUEL
  if ($FUEL !== undefined) {
    writeVarint32(bb, 281)
    writeDouble(bb, $FUEL)
  }

  // optional double G = 36;
  let $G = message.G
  if ($G !== undefined) {
    writeVarint32(bb, 289)
    writeDouble(bb, $G)
  }

  // optional double GS = 37;
  let $GS = message.GS
  if ($GS !== undefined) {
    writeVarint32(bb, 297)
    writeDouble(bb, $GS)
  }

  // optional double VS = 38;
  let $VS = message.VS
  if ($VS !== undefined) {
    writeVarint32(bb, 305)
    writeDouble(bb, $VS)
  }

  // optional double TRK = 39;
  let $TRK = message.TRK
  if ($TRK !== undefined) {
    writeVarint32(bb, 313)
    writeDouble(bb, $TRK)
  }

  // optional double Thrust = 40;
  let $Thrust = message.Thrust
  if ($Thrust !== undefined) {
    writeVarint32(bb, 321)
    writeDouble(bb, $Thrust)
  }

  // optional double FF = 41;
  let $FF = message.FF
  if ($FF !== undefined) {
    writeVarint32(bb, 329)
    writeDouble(bb, $FF)
  }

  // optional Pilot pilot = 42;
  let $pilot = message.pilot
  if ($pilot !== undefined) {
    writeVarint32(bb, 338)
    let nested = popByteBuffer()
    _encodePilot($pilot, nested)
    writeVarint32(bb, nested.limit)
    writeByteBuffer(bb, nested)
    pushByteBuffer(nested)
  }

  // optional bool IS_P6DOF = 43;
  let $IS_P6DOF = message.IS_P6DOF
  if ($IS_P6DOF !== undefined) {
    writeVarint32(bb, 344)
    writeByte(bb, $IS_P6DOF ? 1 : 0)
  }
}

export function decodeMU(binary) {
  return _decodeMU(wrapByteBuffer(binary))
}

function _decodeMU(bb) {
  let message = {}

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb)

    switch (tag >>> 3) {
      case 0:
        break end_of_message

      // optional bytes MessageType = 1;
      case 1: {
        message.MessageType = readBytes(bb, readVarint32(bb))
        break
      }

      // optional double T = 2;
      case 2: {
        message.T = readDouble(bb)
        break
      }

      // optional int32 Id = 3;
      case 3: {
        message.Id = readVarint32(bb)
        break
      }

      // optional bytes disID = 4;
      case 4: {
        message.disID = readBytes(bb, readVarint32(bb))
        break
      }

      // optional bytes entityID = 5;
      case 5: {
        message.entityID = readBytes(bb, readVarint32(bb))
        break
      }

      // optional bytes Name = 6;
      case 6: {
        message.Name = readBytes(bb, readVarint32(bb))
        break
      }

      // optional bytes Type = 7;
      case 7: {
        message.Type = readBytes(bb, readVarint32(bb))
        break
      }

      // optional bytes Side = 8;
      case 8: {
        message.Side = readBytes(bb, readVarint32(bb))
        break
      }

      // optional int64 Index = 9;
      case 9: {
        message.Index = readVarint64(bb, /* unsigned */ false)
        break
      }

      // optional double Lon = 10;
      case 10: {
        message.Lon = readDouble(bb)
        break
      }

      // optional double Lat = 11;
      case 11: {
        message.Lat = readDouble(bb)
        break
      }

      // optional double Alt = 12;
      case 12: {
        message.Alt = readDouble(bb)
        break
      }

      // optional double HDG = 13;
      case 13: {
        message.HDG = readDouble(bb)
        break
      }

      // optional double Pitch = 14;
      case 14: {
        message.Pitch = readDouble(bb)
        break
      }

      // optional double Roll = 15;
      case 15: {
        message.Roll = readDouble(bb)
        break
      }

      // optional double SPD = 16;
      case 16: {
        message.SPD = readDouble(bb)
        break
      }

      // optional double SpeedNED0 = 17;
      case 17: {
        message.SpeedNED0 = readDouble(bb)
        break
      }

      // optional double SpeedNED1 = 18;
      case 18: {
        message.SpeedNED1 = readDouble(bb)
        break
      }

      // optional double SpeedNED2 = 19;
      case 19: {
        message.SpeedNED2 = readDouble(bb)
        break
      }

      // optional double AccelNED0 = 20;
      case 20: {
        message.AccelNED0 = readDouble(bb)
        break
      }

      // optional double AccelNED1 = 21;
      case 21: {
        message.AccelNED1 = readDouble(bb)
        break
      }

      // optional double AccelNED2 = 22;
      case 22: {
        message.AccelNED2 = readDouble(bb)
        break
      }

      // optional double FuelQ = 23;
      case 23: {
        message.FuelQ = readDouble(bb)
        break
      }

      // optional double FuelCRate = 24;
      case 24: {
        message.FuelCRate = readDouble(bb)
        break
      }

      // repeated Weapon Weapons = 25;
      case 25: {
        let limit = pushTemporaryLength(bb)
        let values = message.Weapons || (message.Weapons = [])
        values.push(_decodeWeapon(bb))
        bb.limit = limit
        break
      }

      // optional double TAS = 26;
      case 26: {
        message.TAS = readDouble(bb)
        break
      }

      // optional double CAS = 27;
      case 27: {
        message.CAS = readDouble(bb)
        break
      }

      // optional double IAS = 28;
      case 28: {
        message.IAS = readDouble(bb)
        break
      }

      // optional double M = 29;
      case 29: {
        message.M = readDouble(bb)
        break
      }

      // optional double AGL = 30;
      case 30: {
        message.AGL = readDouble(bb)
        break
      }

      // optional double AOA = 31;
      case 31: {
        message.AOA = readDouble(bb)
        break
      }

      // optional double SSA = 32;
      case 32: {
        message.SSA = readDouble(bb)
        break
      }

      // optional double RRT = 33;
      case 33: {
        message.RRT = readDouble(bb)
        break
      }

      // optional double TRT = 34;
      case 34: {
        message.TRT = readDouble(bb)
        break
      }

      // optional double FUEL = 35;
      case 35: {
        message.FUEL = readDouble(bb)
        break
      }

      // optional double G = 36;
      case 36: {
        message.G = readDouble(bb)
        break
      }

      // optional double GS = 37;
      case 37: {
        message.GS = readDouble(bb)
        break
      }

      // optional double VS = 38;
      case 38: {
        message.VS = readDouble(bb)
        break
      }

      // optional double TRK = 39;
      case 39: {
        message.TRK = readDouble(bb)
        break
      }

      // optional double Thrust = 40;
      case 40: {
        message.Thrust = readDouble(bb)
        break
      }

      // optional double FF = 41;
      case 41: {
        message.FF = readDouble(bb)
        break
      }

      // optional Pilot pilot = 42;
      case 42: {
        let limit = pushTemporaryLength(bb)
        message.pilot = _decodePilot(bb)
        bb.limit = limit
        break
      }

      // optional bool IS_P6DOF = 43;
      case 43: {
        message.IS_P6DOF = !!readByte(bb)
        break
      }

      default:
        skipUnknownField(bb, tag & 7)
    }
  }

  return message
}

function pushTemporaryLength(bb) {
  let length = readVarint32(bb)
  let limit = bb.limit
  bb.limit = bb.offset + length
  return limit
}

function skipUnknownField(bb, type) {
  switch (type) {
    case 0:
      while (readByte(bb) & 0x80) {}
      break
    case 2:
      skip(bb, readVarint32(bb))
      break
    case 5:
      skip(bb, 4)
      break
    case 1:
      skip(bb, 8)
      break
    default:
      throw new Error('Unimplemented type: ' + type)
  }
}

function stringToLong(value) {
  return {
    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
    unsigned: false
  }
}

function longToString(value) {
  let low = value.low
  let high = value.high
  return String.fromCharCode(
    low & 0xffff,
    low >>> 16,
    high & 0xffff,
    high >>> 16
  )
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

let f32 = new Float32Array(1)
let f32_u8 = new Uint8Array(f32.buffer)

let f64 = new Float64Array(1)
let f64_u8 = new Uint8Array(f64.buffer)

function intToLong(value) {
  value |= 0
  return {
    low: value,
    high: value >> 31,
    unsigned: value >= 0
  }
}

let bbStack = []

function popByteBuffer() {
  const bb = bbStack.pop()
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 }
  bb.offset = bb.limit = 0
  return bb
}

function pushByteBuffer(bb) {
  bbStack.push(bb)
}

function wrapByteBuffer(bytes) {
  return { bytes, offset: 0, limit: bytes.length }
}

function toUint8Array(bb) {
  let bytes = bb.bytes
  let limit = bb.limit
  return bytes.length === limit ? bytes : bytes.subarray(0, limit)
}

function skip(bb, offset) {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit')
  }
  bb.offset += offset
}

function isAtEnd(bb) {
  return bb.offset >= bb.limit
}

function grow(bb, count) {
  let bytes = bb.bytes
  let offset = bb.offset
  let limit = bb.limit
  let finalOffset = offset + count
  if (finalOffset > bytes.length) {
    let newBytes = new Uint8Array(finalOffset * 2)
    newBytes.set(bytes)
    bb.bytes = newBytes
  }
  bb.offset = finalOffset
  if (finalOffset > limit) {
    bb.limit = finalOffset
  }
  return offset
}

function advance(bb, count) {
  let offset = bb.offset
  if (offset + count > bb.limit) {
    throw new Error('Read past limit')
  }
  bb.offset += count
  return offset
}

function readBytes(bb, count) {
  let offset = advance(bb, count)
  return bb.bytes.subarray(offset, offset + count)
}

function writeBytes(bb, buffer) {
  let offset = grow(bb, buffer.length)
  bb.bytes.set(buffer, offset)
}

function readString(bb, count) {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  let offset = advance(bb, count)
  let fromCharCode = String.fromCharCode
  let bytes = bb.bytes
  let invalid = '\uFFFD'
  let text = ''

  for (let i = 0; i < count; i++) {
    let c1 = bytes[i + offset],
      c2,
      c3,
      c4,
      c

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1)
    }

    // 2 bytes
    else if ((c1 & 0xe0) === 0xc0) {
      if (i + 1 >= count) text += invalid
      else {
        c2 = bytes[i + offset + 1]
        if ((c2 & 0xc0) !== 0x80) text += invalid
        else {
          c = ((c1 & 0x1f) << 6) | (c2 & 0x3f)
          if (c < 0x80) text += invalid
          else {
            text += fromCharCode(c)
            i++
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xf0) == 0xe0) {
      if (i + 2 >= count) text += invalid
      else {
        c2 = bytes[i + offset + 1]
        c3 = bytes[i + offset + 2]
        if (((c2 | (c3 << 8)) & 0xc0c0) !== 0x8080) text += invalid
        else {
          c = ((c1 & 0x0f) << 12) | ((c2 & 0x3f) << 6) | (c3 & 0x3f)
          if (c < 0x0800 || (c >= 0xd800 && c <= 0xdfff)) text += invalid
          else {
            text += fromCharCode(c)
            i += 2
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xf8) == 0xf0) {
      if (i + 3 >= count) text += invalid
      else {
        c2 = bytes[i + offset + 1]
        c3 = bytes[i + offset + 2]
        c4 = bytes[i + offset + 3]
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xc0c0c0) !== 0x808080)
          text += invalid
        else {
          c =
            ((c1 & 0x07) << 0x12) |
            ((c2 & 0x3f) << 0x0c) |
            ((c3 & 0x3f) << 0x06) |
            (c4 & 0x3f)
          if (c < 0x10000 || c > 0x10ffff) text += invalid
          else {
            c -= 0x10000
            text += fromCharCode((c >> 10) + 0xd800, (c & 0x3ff) + 0xdc00)
            i += 3
          }
        }
      }
    } else text += invalid
  }

  return text
}

function writeString(bb, text) {
  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
  let n = text.length
  let byteCount = 0

  // Write the byte count first
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i)
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35fdc00
    }
    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4
  }
  writeVarint32(bb, byteCount)

  let offset = grow(bb, byteCount)
  let bytes = bb.bytes

  // Then write the bytes
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i)
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35fdc00
    }
    if (c < 0x80) {
      bytes[offset++] = c
    } else {
      if (c < 0x800) {
        bytes[offset++] = ((c >> 6) & 0x1f) | 0xc0
      } else {
        if (c < 0x10000) {
          bytes[offset++] = ((c >> 12) & 0x0f) | 0xe0
        } else {
          bytes[offset++] = ((c >> 18) & 0x07) | 0xf0
          bytes[offset++] = ((c >> 12) & 0x3f) | 0x80
        }
        bytes[offset++] = ((c >> 6) & 0x3f) | 0x80
      }
      bytes[offset++] = (c & 0x3f) | 0x80
    }
  }
}

function writeByteBuffer(bb, buffer) {
  let offset = grow(bb, buffer.limit)
  let from = bb.bytes
  let to = buffer.bytes

  // This for loop is much faster than subarray+set on V8
  for (let i = 0, n = buffer.limit; i < n; i++) {
    from[i + offset] = to[i]
  }
}

function readByte(bb) {
  return bb.bytes[advance(bb, 1)]
}

function writeByte(bb, value) {
  let offset = grow(bb, 1)
  bb.bytes[offset] = value
}

function readFloat(bb) {
  let offset = advance(bb, 4)
  let bytes = bb.bytes

  // Manual copying is much faster than subarray+set in V8
  f32_u8[0] = bytes[offset++]
  f32_u8[1] = bytes[offset++]
  f32_u8[2] = bytes[offset++]
  f32_u8[3] = bytes[offset++]
  return f32[0]
}

function writeFloat(bb, value) {
  let offset = grow(bb, 4)
  let bytes = bb.bytes
  f32[0] = value

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f32_u8[0]
  bytes[offset++] = f32_u8[1]
  bytes[offset++] = f32_u8[2]
  bytes[offset++] = f32_u8[3]
}

function readDouble(bb) {
  let offset = advance(bb, 8)
  let bytes = bb.bytes

  // Manual copying is much faster than subarray+set in V8
  f64_u8[0] = bytes[offset++]
  f64_u8[1] = bytes[offset++]
  f64_u8[2] = bytes[offset++]
  f64_u8[3] = bytes[offset++]
  f64_u8[4] = bytes[offset++]
  f64_u8[5] = bytes[offset++]
  f64_u8[6] = bytes[offset++]
  f64_u8[7] = bytes[offset++]
  return f64[0]
}

function writeDouble(bb, value) {
  let offset = grow(bb, 8)
  let bytes = bb.bytes
  f64[0] = value

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f64_u8[0]
  bytes[offset++] = f64_u8[1]
  bytes[offset++] = f64_u8[2]
  bytes[offset++] = f64_u8[3]
  bytes[offset++] = f64_u8[4]
  bytes[offset++] = f64_u8[5]
  bytes[offset++] = f64_u8[6]
  bytes[offset++] = f64_u8[7]
}

function readInt32(bb) {
  let offset = advance(bb, 4)
  let bytes = bb.bytes
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  )
}

function writeInt32(bb, value) {
  let offset = grow(bb, 4)
  let bytes = bb.bytes
  bytes[offset] = value
  bytes[offset + 1] = value >> 8
  bytes[offset + 2] = value >> 16
  bytes[offset + 3] = value >> 24
}

function readInt64(bb, unsigned) {
  return {
    low: readInt32(bb),
    high: readInt32(bb),
    unsigned
  }
}

function writeInt64(bb, value) {
  writeInt32(bb, value.low)
  writeInt32(bb, value.high)
}

function readVarint32(bb) {
  let c = 0
  let value = 0
  let b
  do {
    b = readByte(bb)
    if (c < 32) value |= (b & 0x7f) << c
    c += 7
  } while (b & 0x80)
  return value
}

function writeVarint32(bb, value) {
  value >>>= 0
  while (value >= 0x80) {
    writeByte(bb, (value & 0x7f) | 0x80)
    value >>>= 7
  }
  writeByte(bb, value)
}

function readVarint64(bb, unsigned) {
  let part0 = 0
  let part1 = 0
  let part2 = 0
  let b

  b = readByte(bb)
  part0 = b & 0x7f
  if (b & 0x80) {
    b = readByte(bb)
    part0 |= (b & 0x7f) << 7
    if (b & 0x80) {
      b = readByte(bb)
      part0 |= (b & 0x7f) << 14
      if (b & 0x80) {
        b = readByte(bb)
        part0 |= (b & 0x7f) << 21
        if (b & 0x80) {
          b = readByte(bb)
          part1 = b & 0x7f
          if (b & 0x80) {
            b = readByte(bb)
            part1 |= (b & 0x7f) << 7
            if (b & 0x80) {
              b = readByte(bb)
              part1 |= (b & 0x7f) << 14
              if (b & 0x80) {
                b = readByte(bb)
                part1 |= (b & 0x7f) << 21
                if (b & 0x80) {
                  b = readByte(bb)
                  part2 = b & 0x7f
                  if (b & 0x80) {
                    b = readByte(bb)
                    part2 |= (b & 0x7f) << 7
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    low: part0 | (part1 << 28),
    high: (part1 >>> 4) | (part2 << 24),
    unsigned
  }
}

function writeVarint64(bb, value) {
  let part0 = value.low >>> 0
  let part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0
  let part2 = value.high >>> 24

  // ref: src/google/protobuf/io/coded_stream.cc
  let size =
    part2 === 0
      ? part1 === 0
        ? part0 < 1 << 14
          ? part0 < 1 << 7
            ? 1
            : 2
          : part0 < 1 << 21
          ? 3
          : 4
        : part1 < 1 << 14
        ? part1 < 1 << 7
          ? 5
          : 6
        : part1 < 1 << 21
        ? 7
        : 8
      : part2 < 1 << 7
      ? 9
      : 10

  let offset = grow(bb, size)
  let bytes = bb.bytes

  switch (size) {
    case 10:
      bytes[offset + 9] = (part2 >>> 7) & 0x01
    case 9:
      bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7f
    case 8:
      bytes[offset + 7] =
        size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7f
    case 7:
      bytes[offset + 6] =
        size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7f
    case 6:
      bytes[offset + 5] =
        size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7f
    case 5:
      bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7f
    case 4:
      bytes[offset + 3] =
        size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7f
    case 3:
      bytes[offset + 2] =
        size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7f
    case 2:
      bytes[offset + 1] =
        size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7f
    case 1:
      bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7f
  }
}

function readVarint32ZigZag(bb) {
  let value = readVarint32(bb)

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1)
}

function writeVarint32ZigZag(bb, value) {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31))
}

function readVarint64ZigZag(bb) {
  let value = readVarint64(bb, /* unsigned */ false)
  let low = value.low
  let high = value.high
  let flip = -(low & 1)

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false
  }
}

function writeVarint64ZigZag(bb, value) {
  let low = value.low
  let high = value.high
  let flip = high >> 31

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false
  })
}
