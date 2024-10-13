import { useEffect, useState } from "react";

import { blockPost, blockUser, deletePost, deleteUser, getAllPosts, getAllUsers } from "../../../Services/apiService/adminServices";
import "./PostMangement.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Confirm from "../../../Components/Confirm/Confirm";
import EditPost from "./EditPost";
import ReportModalAdmin from "./reportModalAdmin";
function PostManagement() {
    const [block, setBlock] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const admin = useSelector((data: any) => data.auth.adminData);
    const navigate = useNavigate();
    const [type, setType] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [allPosts, setAllPosts] = useState<any[]>([]);
    const [_id, set_id] = useState<Record<string, any>>({});
    const [confirm, setConfirm] = useState<boolean>(false);
    const [edit, setEdit] = useState<string | null>(null);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const [toggleReportModal, setToggleReportModal] = useState<boolean>(false);
    const [post, setPost] = useState<any>({});

    const banPost = async (postId: string): Promise<void> => {
        await blockPost(postId);
        setAllPosts(
            allPosts.map((obj: any) => {
                if (obj._id == postId) {
                    obj.isBlocked = !obj.isBlocked;
                }
                return obj;
            })
        );
    };

    const handleConfirm = async (arg: any) => {
        if (arg) {
            await deletePost(_id._id);
            setBlock(!block);
        }
    };

    const handleDelete = (obj: any) => {
        setConfirm(true);
        set_id(obj);
    };

    const next = () => {
        if (allPosts.length < 10) {
            toast.error("Max Page Limit Reached");
        } else {
            async function fetchData() {
                const result = await getAllPosts(page + 1, type, search);
                setPage(page + 1);

                if (result) {
                    setAllPosts(result?.data?.posts);
                }
            }
            fetchData();
        }
    };

    const previous = () => {
        if (page >= 1) {
            async function fetchData() {
                const result = await getAllPosts(page - 1, type, search);
                setPage(page - 1);
                if (result) {
                    setAllPosts(result?.data?.posts);
                }
            }
            fetchData();
        } else {
            toast.error("Invalid Page");
        }
    };

    const searchUser = (e: any) => {
        const searchValue = e.target.value;

        setSearch(searchValue);
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const newTimout = setTimeout(() => {
            setSearchValue(searchValue);
        }, 500);

        setDebounceTimeout(newTimout);
    };

    useEffect(() => {
        document.title = "Post Management";
        if (!admin) {
            navigate("/admin/login");
        }
        async function fetchData() {
            const result = await getAllPosts(page, type, search);

            if (result) {
                setAllPosts(result?.data?.posts);
            }
        }
        fetchData();
    }, [block, admin, type, edit, searchValue]);

    return edit ? (
        <EditPost edit={edit} setEdit={setEdit} />
    ) : (
        <div className="p-4 h-full">
            {confirm && <Confirm confirm={confirm} setConfirm={setConfirm} handleConfirm={handleConfirm} />}
            {toggleReportModal && <ReportModalAdmin post={post} setToggleReportModal={setToggleReportModal}/>}
            <div className="w-[100%] flex flex-row justify-between">
                <h1 className="text-[20px] mb-4 mt-4">POST MANAGEMENT</h1>
                <div>
                    <input
                        value={search}
                        onChange={(e) => searchUser(e)}
                        type="text"
                        placeholder="Search"
                        name=""
                        id=""
                        className="p-2 text-black mr-2 rounded-md h-8"
                    />

                    <select name="" id="" className="h-8 rounded" onChange={(e) => setType(e.target.value)}>
                        <option value="all">All</option>
                        <option value="blocked">Blocked</option>
                        <option value="active">Active</option>
                        <option value="reported">Reported</option>
                    </select>
                </div>
            </div>
            <div className="card-container">
                {allPosts?.map((obj: any, index) => (
                    <div className="card" key={obj.id}>
                        <div>
                            <strong>ID:</strong> {index}
                        </div>
                        <div>
                            <strong>User:</strong> {obj.userData.name}
                        </div>
                        <div>
                            <strong>Type:</strong> {obj.contentType}
                        </div>
                        <div>
                            <strong>Image:</strong> {obj.isAdmin}
                        </div>
                        <div>
                            <strong>Status:</strong>{" "}
                            <span style={{ color: `${obj.isBlocked ? "red" : "#00FF00"}` }}>{obj.isBlocked ? "Blocked" : "Active"}</span>
                        </div>
                        <div>
                            <strong>Comments:</strong> {obj.comments.length}
                        </div>
                        <div>
                            <strong>Like:</strong> {obj.likes.length}
                        </div>
                        <div>
                            <td style={{ color: `${obj.isBlocked == "Active" ? "#40fa07" : "red"}` }}>{obj.isBlocked}</td>
                        </div>
                        <div>
                            <strong>Date:</strong> {new Date(obj.createdAt).toDateString()}
                        </div>
                        <td>
                            {obj.isBlocked ? (
                                <i onClick={() => banPost(obj._id)} className={`fa-solid fa-eye fa-lg `}></i>
                            ) : (
                                <i onClick={() => banPost(obj._id)} className={`fa-solid fa-eye-slash fa-lg `}></i>
                            )}
                            <i onClick={() => handleDelete(obj)} className={`fa-solid fa-trash fa-lg`}></i>
                        </td>
                    </div>
                ))}
                <div className="w-full bg-white flex flex-row justify-between bg-[#DEDFE0] p-5">
                    <div
                        onClick={previous}
                        className="prev pointer border-black]"
                        style={{ border: "1px solid gray", borderRadius: "4px", padding: "5px" }}
                    >
                        <h2>
                            <i className="fa-solid fa-arrow-left"></i>Previous
                        </h2>
                    </div>
                    <div className="midd" style={{ border: "1px solid gray", borderRadius: "4px", padding: "5px" }}>
                        <h1 className="w-[20px] flex justify-center">{page}</h1>
                    </div>
                    <div onClick={next} className="next" style={{ border: "1px solid gray", borderRadius: "4px", padding: "5px" }}>
                        <h2>
                            Next<i className="fa-solid fa-arrow-right"></i>
                        </h2>
                    </div>
                </div>
            </div>

            {/* Table for Larger Screens */}
            <div className="table-container">
                <table id="table" className="w-full bg-white">
                    <thead>
                        <tr className="bg-[#359CCE]">
                            <th>ID</th>
                            <th>User</th>
                            <th>Type</th>
                            <th>Image</th>
                            <th>Status</th>
                            <th>Comments</th>
                            <th>Like</th>
                            <th>Report</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#359CCE]">
                        {allPosts.map((obj: any, index) => (
                            <tr key={obj._id}>
                                <td>{index}</td>
                                <td>{obj.userData.name}</td>
                                <td>{obj.contentType}</td>
                                <td className="flex justify-center items-center">
                                    {/* // check image or video */}

                                    {obj.contentType == "image" ? (
                                        <img src={obj.images[0]} className="w-[35[px] border h-[35px]" alt="" />
                                    ) : (
                                        <video controls src={obj.video} height={"50px"} width={"50px"} />
                                    )}
                                </td>
                                <td>
                                    <span style={{ color: `${obj.isBlocked ? "red" : "#00FF00"}` }}>{obj.isBlocked ? "Blocked" : "Active"}</span>
                                </td>

                                <td className="">{obj.comments.length}</td>
                                <td>{obj?.likes?.length}</td>
                                <td>
                                    {obj?.reported?.length ? obj.reported?.length : "No"} Reports{" "}
                                    {obj?.reported?.length > 0 && (
                                        <i onClick={()=>{{setPost(obj?._id);setToggleReportModal(true)}}} className="fa-solid fa-circle-exclamation cursor-pointer" style={{ color: "#fff" }}></i>
                                    )}
                                </td>
                                <td>{new Date(obj.createdAt).toDateString()}</td>
                                <td className="">
                                    {obj.isBlocked ? (
                                        <i onClick={() => banPost(obj._id)} className={`fa-solid fa-eye fa-lg `}></i>
                                    ) : (
                                        <i onClick={() => banPost(obj._id)} className={`fa-solid  fa-eye-slash fa-lg `}></i>
                                    )}
                                    <i onClick={() => handleDelete(obj)} className={`fa-solid ml-1 fa-trash fa-lg`}></i>
                                    <i onClick={() => setEdit(obj)} className={`fa-solid ml-1 fa-pen-to-square fa-lg`}></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="w-full bg-white flex flex-row justify-between bg-[#DEDFE0] p-5">
                    <div
                        onClick={previous}
                        className="prev pointer border-black]"
                        style={{ border: "1px solid gray", borderRadius: "4px", padding: "5px" }}
                    >
                        <h2>
                            <i className="fa-solid fa-arrow-left"></i>Previous
                        </h2>
                    </div>
                    <div className="midd" style={{ border: "1px solid gray", borderRadius: "4px", padding: "5px" }}>
                        <h1 className="w-[20px] flex justify-center">{page + 1}</h1>
                    </div>
                    <div onClick={next} className="next" style={{ border: "1px solid gray", borderRadius: "4px", padding: "5px" }}>
                        <h2>
                            Next<i className="fa-solid fa-arrow-right"></i>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostManagement;
