export const MAX_PROFILE_PHOTO_BYTES=128*1024;
export function validateProfilePhoto(bytes:Uint8Array){
 if(bytes.length>MAX_PROFILE_PHOTO_BYTES||bytes.length<16)throw Error('프로필 사진은 128KB 이하의 JPEG 이미지여야 합니다.');
 if(bytes[0]!==255||bytes[1]!==216||bytes.at(-2)!==255||bytes.at(-1)!==217)throw Error('올바른 JPEG 사진을 선택해주세요.');
 let offset=2;
 while(offset+4<bytes.length){
  if(bytes[offset++]!==255)break;
  while(bytes[offset]===255)offset++;
  const marker=bytes[offset++];
  if(marker===218||marker===217)break;
  if(marker===1||(marker>=208&&marker<=215))continue;
  const length=(bytes[offset]<<8)|bytes[offset+1];
  if(length<2||offset+length>bytes.length)break;
  if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)){
   if(length<8)break;
   const height=(bytes[offset+3]<<8)|bytes[offset+4],width=(bytes[offset+5]<<8)|bytes[offset+6];
   if(width<1||height<1||width>512||height>512||width!==height)throw Error('정사각형 512px 이하의 사진을 사용해주세요.');
   return {width,height};
  }
  offset+=length;
 }
 throw Error('사진 형식을 확인하지 못했습니다. 다른 사진을 선택해주세요.');
}
