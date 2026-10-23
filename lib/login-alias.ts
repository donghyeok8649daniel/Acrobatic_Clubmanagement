type LoginTarget={teamId:string;memberId?:string};

// Account aliases are private deployment configuration, never browser data.
// A member restriction keeps a captain alias from accepting another member's
// otherwise valid team entry code. Canonical team logins remain unchanged.
export function resolveLoginIdentifier(value:string,configuration?:string):LoginTarget{
 const identifier=value.trim().toUpperCase(),fallback={teamId:identifier};
 if(!configuration)return fallback;
 try{
  const aliases=JSON.parse(configuration);
  if(!aliases||typeof aliases!=='object'||Array.isArray(aliases)||!Object.hasOwn(aliases,identifier))return fallback;
  const target=aliases[identifier];
  if(!target||typeof target.teamId!=='string'||typeof target.memberId!=='string'||!/^[-\w]{1,60}$/.test(target.teamId)||!/^[-\w]{1,80}$/.test(target.memberId))return fallback;
  return {teamId:target.teamId,memberId:target.memberId};
 }catch{return fallback;}
}
