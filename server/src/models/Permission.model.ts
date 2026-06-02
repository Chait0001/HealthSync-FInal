import mongoose,{Schema,Types} from "mongoose"; 
const permissionschema=new Schema({
  key: {type: String,required:true,unique:true},
  module: {type:String,required:true},
  action: {type:String,required:true},
  category: {type:String},
  is_system: {type:Boolean,default:true},
  status: {type:String,enum:["active","inactive"],default:"active"},
}, { timestamps: true })
export const PermissionModel=mongoose.model("Permission",permissionschema);