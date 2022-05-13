import axios from "axios";
export const getcurrentcity=()=>{
   const localcity=JSON.parse(localStorage.getItem('hkzf_localcity'))
   if(!localcity){
       return new Promise((resolve,reject)=>{
        var myCity = new window.BMapGL.LocalCity();
        myCity.get(async res=>{
            try{
         const result = await axios.get(
           `http://localhost:8088/area/info?name=${res.name}`
         )
         localStorage.setItem('hkzf_localcity',JSON.stringify(result.data.body))
         resolve(result.data.body)
            }catch(e){
              reject(e)
            }
       }

       )
       
       })
   }else{
       return Promise.resolve(localcity)
   }
}