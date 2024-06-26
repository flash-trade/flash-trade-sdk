import BN from "bn.js";
import { BN_ONE, BN_ZERO } from "../constants";
import { Connection, PublicKey } from "@solana/web3.js";
import BigNumber from 'bignumber.js'

export const getUnixTs = () => {
    return new Date().getTime() / 1000;
  };

// converts NATIVE TOKEN AMOUNT example - 5000 lamport in SOL to 0.005 SOL
// convert raw BigNumber / Number/ string to corresponding decimals with safe division
// 99999123456
// 99999.123456
// 99999.123
export function toUiDecimalsOldSDK(
  nativeAmount: BN | number | string,
  decimals: number,
  precision = 3,
  commaSeperated = false
): string {
  // TODO: remove BN and upgrade to bigint https://github.com/solana-labs/solana/issues/27440

  if (precision > decimals) {
      throw 'not allowed precision> decimals'
  }
  let r = ''

  if (nativeAmount instanceof BN) {
      const nativeAmountString = nativeAmount.toString()
      // get decimals
      const d = nativeAmountString.slice(decimals * -1)
      const p = d.slice(0, precision)
      const nativeAmountWithoutDecimalsStr = nativeAmount.div(new BN(10 ** decimals)).toString()

      r = nativeAmountWithoutDecimalsStr + '.' + p
  } else if (typeof nativeAmount === 'string') {
      if (isNaN(Number(nativeAmount))) {
          throw 'String No valid '
      }
      if (nativeAmount.length < decimals) {
          // happens when trying to round off big BTC number without decimals to floating point
          // ex -  toUiDecimals("110000",8) => should give 0.011 and not 0.11
          // nativeAmount = [...Array(decimals - nativeAmount.length).keys()].map((c) => '0').join('') + nativeAmount
          // prepend zeros to the nativeAmount string until its length becomes equal to decimals
          nativeAmount = nativeAmount.padStart(decimals, '0');
      }
      const d = nativeAmount.slice(decimals * -1)
      const p = d.slice(0, precision)
      const nativeAmountWithoutDecimalsStr = new BN(nativeAmount).div(new BN(10 ** decimals)).toString()

      r = nativeAmountWithoutDecimalsStr + '.' + p
  } else if (typeof nativeAmount === 'number') {
      const d = nativeAmount.toString().slice(decimals * -1)
      const p = d.slice(0, precision)
      const nativeAmountWithoutDecimalsStr = new BN(nativeAmount).div(new BN(10 ** decimals)).toString()
      r = nativeAmountWithoutDecimalsStr + '.' + p
  } else {
      return 'type unknown'
  }

  if (commaSeperated) {
      return Number(r).toLocaleString()
  } else {
      return r
  }
}

export const uiDecimalsToNative = ( amountUi : string, decimals : number) :BN =>{
  // return (new BN(amountUi)).mul(new BN(10 ** decimals)) // will fail for 1.000001000
  const valueBigNumber = (new BigNumber(amountUi)).multipliedBy(new BigNumber(10 ** decimals))
  return new BN(valueBigNumber.toFixed(0,BigNumber.ROUND_DOWN));
}

export const validateNumberString = (str: string) => {
  // console.log("validateNumberString:",str)
  // Check if undefined
  if (typeof str === 'undefined') {
      //   return 'undefined';
      // console.log("str undefined")
      return false
  }

  // Check if empty
  if (str.trim() === '') {
      //   return 'empty';
      // console.log("str empty")
      return false
  }

  // Check if invalid number
  if (isNaN(Number(str))) {
      //   return 'invalid';
      // console.log("str invalid")
      return false
  }
  // return 'valid';
  return true
}

// similar to toUiDecimals from mango 
export function nativeToUiDecimals(
  nativeAmount: BN | number | string | BigNumber,
  decimals: number,
  precision?: number, // by default, pricision is decimals
  commaSeperated?: boolean
): string {
  // possible here  nativeToUiDecimals('123456',0,2) => 123456.00
  // if (precision > decimals) {
  //     throw 'nativeToUiDecimals : not allowed precision > decimals'
  // }
  if(!precision) precision = decimals; 
  if(!validateNumberString(nativeAmount.toString())){
    console.log("error - nativeAmount:",nativeAmount)
    throw `nativeToUiDecimals error: ${nativeAmount} Not valid `
  }
  if (nativeAmount instanceof BigNumber) {
    // no check need 
  } 
  else if (nativeAmount instanceof BN) {
     // no check need 
    // console.log("BN type")
  } else if (typeof nativeAmount === 'string') {
      // console.log("string type")
      if (isNaN(Number(nativeAmount))) {
          throw new Error(`nativeToUiDecimals error: String Not valid ::: ${nativeAmount}`);
      }
  } else if (typeof nativeAmount === 'number') {
     // no check need 
    //  console.log("number type")
  } else {
      // return 'nativeToUiDecimals type unknown'
  }
  const denominator = (new BigNumber(10)).pow(decimals);
  let r  = (new BigNumber(nativeAmount.toString())).div(denominator).toFixed(precision,BigNumber.ROUND_DOWN)

  if (commaSeperated) {
      return Number(r).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  } else {
      return r
  }
}

export async function checkIfAccountExists(
  account: PublicKey,
  connection: Connection
): Promise<boolean> {
  // console.log("connection print", connection);
  let bal = await connection.getBalance(account);
  if (bal > 0) {
    return true;
  } else {
    return false;
  }
}

export const scaleToExponent = (arg: BN, exponent: BN, target_exponent: BN) : BN => {
    if (target_exponent.eq(exponent)) {
        return arg;
    }
    let delta = target_exponent.sub(exponent);
    if (delta.gt(BN_ZERO)) {
      return arg.div( new BN(10).pow(delta) );
    } else {
        return arg.mul( new BN(10).pow(delta.muln(-1)))
    }
}

// ceil(a/b) = ((a + b - 1) / b) , if a>=0
export const checkedCeilDiv = (arg1: BN, arg2: BN) => {
    if (arg1.gt(BN_ZERO)){
        if (arg1.eq(arg2) && !arg2.isZero()) {
            return BN_ONE;
        }
        let res = (arg1.sub(BN_ONE)).div(arg2);
        if(!res){
          throw Error("error :: MathOverflow")
        }
        return res.add(BN_ONE);
    } else {
      let res = (arg1).div(arg2);
      if(!res){
        throw Error("error :: MathOverflow")
      }
      return res;
    }
}

export const checkedDecimalCeilMul = (
    coefficient1: BN,
    exponent1: BN,
    coefficient2: BN,
    exponent2: BN,
    target_exponent: BN,
) : BN => {
    if (coefficient1.isZero() || coefficient2.isZero()) {
        return BN_ZERO;
    }
    let target_power = (exponent1.add(exponent2)).sub(target_exponent); 
    if (target_power.gt(BN_ZERO) ){
        // checked_as_u64(checked_mul(
        //     checked_mul(coefficient1 as u128, coefficient2 as u128)?,
        //     checked_pow(10u128, target_power as usize)?,
        // )?)
        
         return (coefficient1.mul(coefficient2)).mul(new BN(10).pow(target_power));
        
    } else {
        // checked_as_u64(checked_ceil_div(
        //     checked_mul(coefficient1 as u128, coefficient2 as u128)?,
        //     checked_pow(10u128, (-target_power) as usize)?,
        // )?)

        // ceil(a/b) = ((a + b - 1) / b) , if a>=0
        //  
        const a = (coefficient1.mul(coefficient2));
        const b = (new BN(10).pow(target_power.muln(-1)))
        // return (a.add(b).subn(1)).div(b);
        return checkedCeilDiv(a,b);
    }
}

export const checkedDecimalMul = (
  coefficient1: BN,
  exponent1: BN,
  coefficient2: BN,
  exponent2: BN,
  target_exponent: BN,
) : BN => {
  if (coefficient1.isZero() || coefficient2.isZero()) {
      return BN_ZERO;
  }
  let target_power = (exponent1.add(exponent2)).sub(target_exponent); 
  if (target_power.gt(BN_ZERO) ){
      // checked_as_u64(checked_mul(
      //     checked_mul(coefficient1 as u128, coefficient2 as u128)?,
      //     checked_pow(10u128, target_power as usize)?,
      // )?)
      
       return (coefficient1.mul(coefficient2)).mul(new BN(10).pow(target_power));
      
  } else {
    // checked_as_u64(checked_div(
    //   checked_mul(coefficient1 as u128, coefficient2 as u128)?,
    //   checked_pow(10u128, (-target_power) as usize)?,
    // )?)

      return (coefficient1.mul(coefficient2))
              .div 
              (new BN(10).pow(target_power.muln(-1)));
  }
}

export const checkedDecimalDiv = (
  coefficient1: BN,
  exponent1: BN,
  coefficient2: BN,
  exponent2: BN,
  target_exponent: BN,
) : BN => {
  if (coefficient2.isZero()) {
      // msg!("Error: Overflow in {} / {}", coefficient1, coefficient2);
      // return err!(PerpetualsError::MathOverflow);
      throw Error(`"Error: Overflow in ${coefficient1} / ${coefficient2}`)
  }
  if (coefficient1.isZero()) {
      return BN_ZERO;
  }
  // compute scale factor for the dividend
  let  scale_factor = BN_ZERO;
  let  target_power = (exponent1.sub(exponent2)).sub(target_exponent);
  if (exponent1.gt(BN_ZERO))  {
      scale_factor = scale_factor.add(exponent1);
  }
  if (exponent2.lt(BN_ZERO)) {
      scale_factor = scale_factor.sub(exponent2);
      target_power = target_power.add(exponent2);
  }
  if (target_exponent.lt(BN_ZERO)) {
      scale_factor = scale_factor.sub(target_exponent);
      target_power = target_power.add(target_exponent);
  }
  let scaled_coeff1 = BN_ZERO;
  if (scale_factor.gt(BN_ZERO)) {
      // checked_mul(
      //     coefficient1 ,
      //     checked_pow(10u128, scale_factor as usize)?,
      // )?
      scaled_coeff1 = coefficient1.mul(
        new BN(10).pow(scale_factor)
      );
  } else {
      scaled_coeff1 = coefficient1;
  };

  if (target_power.gte(BN_ZERO)) {
    //  return (
    //   checked_mul(
    //       checked_div(scaled_coeff1, coefficient2),
    //       checked_pow(10u128, target_power),
    //   ))
   return (scaled_coeff1.div(coefficient2))
     .mul( new BN(10).pow(target_power) );

  } else {
    // return checked_as_u64(checked_div(
    //       checked_div(scaled_coeff1, coefficient2 as u128)?,
    //       checked_pow(10u128, (-target_power) as usize)?,
    //   ))
    return (scaled_coeff1.div(coefficient2))
     .div( new BN(10).pow(target_power.muln(-1)) );

  }
}