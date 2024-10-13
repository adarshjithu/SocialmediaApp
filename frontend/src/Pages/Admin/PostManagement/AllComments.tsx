import React, { useState } from "react";
import Confirm from "../../../Components/Confirm/Confirm";
import { deleteComment } from "../../../Services/apiService/adminServices";

function AllComments(props: any) {
     const [confirm, setConfirm] = useState<boolean>(false);
     const [allComments,setAllComments] = useState(props.allComments)
     const [id, setId] = useState("");
     const deleteCmt = (id: string) => {
          setId(id);
          setConfirm(true);
     };

     const handleConfirm = async (arg: any) => {
          if (arg) {
            const res = await deleteComment(id);
            if(res?.data.success){
                setAllComments(allComments.filter((obj:any)=>{
                   if(obj._id!==id){

                       return obj;
                   }
                }))
            }
            
          }
     };

     return (
          <div>
               {allComments?.map((obj: any) => {
                    return (
                         <div className="p-2 rounded-xl mt-2 " style={{ border: "1px solid gray " }}>
                              {confirm && <Confirm confirm={confirm} setConfirm={setConfirm} handleConfirm={handleConfirm} />}
                              <div className="flex flex-row justify-between">
                                   <img
                                        src={
                                             obj.userId.image
                                                  ? obj.userId.image
                                                  :'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMMAAACUCAMAAAAZKm3XAAAAM1BMVEXk5ueutLepsLPn6erq7O3IzM64vcDh4+Tb3t/Y29yxt7q7wMLFycvT1tjAxcfQ09Wkqq5DriuMAAAElUlEQVR4nO2c3WKzIAyGlfAniHj/V/uBbbeufwrEJu3ne7TtiGeEBGKSrjt06NChQ4cO/YcCKcHYIct06Wfq9ZQKJNgwee3O0n6MRkrqZRUIpB1dfyvhxo/BgE71s7hDyBRzH80n2JRR4iHAGaNXtuONAVa5FwQXCsYQAEqvECwUOgJXCjDTOsBJE9NjIYd7X/RUjqc9xQ1mdGVQgXq9D6SKEBKEYrcTpQj8IGAsRsgQ1Mu+FpTvAredkLGGICtwgYASp/pXXFwsmC3B+bGENtTLP6nmPP9AjNSrz4LQgJAgBg7WVH0YTnL0DLLOrV5thCJ/28m5DSGJ+ljLzdft55qIN8I0WlKWs6QIMLYj9P1IeaxTeMNgIA10UH1R+ivSa9OEcBxysKbbCLAoppSMie7qh2VK6XFNZ0ytMfqHge7mZzwOAqFnAtt43fuVIGMYkEwpMZCF6rKs2EuGSIRgWh5wNwxU9z68I50ONZVzRYpwi4gYDJpbImRARBA0CCjvn29imA8GFgxktoSH0IvDt9brG2IcQn7sIk+1D1jPuPyQo2L4grv3N7yBEN+idLlvvAeEp0uSoeVm6L62Q8BBoPwoh5erJEx8A06UI/3A+xW5e5RvKILQKyVJlG9Z1OUzCAiO+OOuRMj1jdQf2aGZwRETZNfUWusQ6Qs2Wl9zjtqSunwDb9sGHpVkLTc/JrWVYHx9LZynXv1ZX1CT2HJtYlMbWu9gqTIBD1VVaMypzDirAmJmhtCVJ5vmyCC43QhCkXdyLOpab5Ve15u3QmiWCDnYqX4ThegV056m3FsWtvWWDWx7y7q8FXFtK4Rj328J3VqvJXVZ8RZJGZ71WwoXPqWPWkqjvHP974akn5zTyn4KwSIJJqjJe73I+0kFC/yC2pogOZ+lF99as/zyeQJ5ow+CyGsHY0NU43gyJp9MaVQxDLb7AJQ8CiFOOh1hcedgl78J51UwPDnyosygvJgfTxL4wzLPboy2M5x68vPRDaO//9e/AhFuigMTDMhO1LuC9V/FDD3GgRojefwwVQFcOHrtoyX0u3kUiF4b47ABw/lAFP7StQixvlURUEB6PyOWkfVint5b7pAc0cYXWxHGNLztYQEbhpnUQfRTeI+XSq/m+n7pdYo3PFMB4m4EC4WbzM6nW2JVN7yQ2zd5Vjm/oVBC73cqwO5ylB9R7JQQB8TyvXWIXaJFwWAiFAiN/3kFrVRpu7BT+xKrYqxEGtU/NQ8+qIRAjHdVU30whPjZFKVIqUpoTclUu9Bn94QCQWZIeBBSERJkiPbyJvnG4PxErS4WhvZRLM3yTRBgqde/qCliY3bmtqjh7gTE5/lHuvoW21jlhqj6gnAultTn5oJKBnq3+qvKiV+Y7aDNqqt1kvWVhnuoprEXDIPodqWayQ+Sz4E+qzgZyyRCX6u4PB9j3huyitskUHujkVTomtCmQyGquG0IZ9AYrsrKGAkyYhtU1u2B1kSJKjEVGRNNTmxNRVfwho6GPVXSGovZ3I2pks8SiE32qCqap9g2ong/lUQInke66LqBOCwNVwVj/IwXPDU/dK7/AK2aQUVk/2atAAAAAElFTkSuQmCC'
                                        }
                                        className="w-[35px] h-[35px] rounded-[100%]"
                                        alt=""
                                   />
                                   <h1>{obj.userId.name}</h1>
                                   <h1 className="text-[15px]">{new Date(obj.createdAt).toDateString()}</h1>
                                   <i onClick={() => deleteCmt(obj._id)} className="fa-solid mt-2 fa-trash fa-xl" style={{ color: "red" }}></i>
                              </div>
                              <div className="flex justify-center items-center">
                                   <h1>{obj.content}</h1>
                              </div>
                         </div>
                    );
               })}
          </div>
     );
}

export default AllComments;
