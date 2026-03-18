exports.handler = async (event) => {
  const h = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'};
  if(event.httpMethod==='OPTIONS') return {statusCode:200,headers:h,body:''};
  
  let body = {};
  try { body = event.body ? JSON.parse(event.body) : {}; } catch(e){}
  
  // Test subscribe
  if(body.subscribe) {
    try {
      const res = await fetch(process.env.SUPABASE_URL+'/rest/v1/briefing_subscribers', {
        method:'POST',
        headers:{
          'apikey':process.env.SUPABASE_SERVICE_KEY,
          'Authorization':'Bearer '+process.env.SUPABASE_SERVICE_KEY,
          'Content-Type':'application/json',
          'Prefer':'resolution=merge-duplicates'
        },
        body: JSON.stringify({email:body.email, name:body.name||null, active:true, updated_at:new Date().toISOString()})
      });
      const text = await res.text();
      return {statusCode:200,headers:h,body:JSON.stringify({subscribed:res.ok, status:res.status, response:text.slice(0,100)})};
    } catch(err) {
      return {statusCode:500,headers:h,body:JSON.stringify({error:err.message})};
    }
  }
  
  return {statusCode:200,headers:h,body:JSON.stringify({ok:true,method:event.httpMethod})};
};
