import axios from "axios";
import { backendUrl } from "../Web3Api/Web3";
export async function backendPostRequest(subdomain,formdata){
  var res=await axios.post(backendUrl+subdomain, formdata);
  return res;
}