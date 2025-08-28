import React from "react";

const DialogBox = ({ dialog, setDialog, deleteListing, listingId }) => {
  return (
    <>
      <div
        className={`${
          dialog ? "" : "hidden"
        } fixed left-0 top-0 w-full h-[100vh] bg-black opacity-25 z-50`}
        onClick={() => setDialog(false)}
      />
      <div
        className={`${
          dialog ? "" : "hidden"
        } fixed left-0 top-0 w-full h-[100vh] flex justify-center items-center z-50`}
      >
        <div
          className={`bg-gray p-4 flex flex-col justify-center items-center text-white gap-4 px-8 py-6 rounded-md`}
        >
          <p>Are you sure you want to delete the listing</p>
          <div className=" w-full flex justify-between gap-3">
            <button
              className="text-white bg-white bg-opacity-20 w-1/2 rounded-md py-2"
              onClick={() => {
                setDialog(false);
              }}
            >
              Cancel
            </button>
            <button
              className="bg-light-red text-white w-1/2 rounded-md"
              onClick={() => {
                setDialog(false);
                deleteListing(listingId);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DialogBox;
