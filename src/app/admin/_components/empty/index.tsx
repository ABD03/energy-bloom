import { IoLibraryOutline } from "react-icons/io5";
export default function Empty(props: any) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-7.5 text-[#c3c3c3]">
      <IoLibraryOutline size={80} />
      <div>No data found</div>
    </div>
  );
}
