export const Modal = ({ showModal, setShowModal, content }:any) => {
    if (!showModal) return null; // If showModal is false, don't render the modal

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-[300px] p-5 rounded-md shadow-lg">
                <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">Modal Title</h3>
                    <button onClick={() => setShowModal(false)}>✖️</button>
                </div>
                <div className="mt-4">
                    {content} {/* Modal content passed as a prop */}
                </div>
            </div>
        </div>
    );
};
