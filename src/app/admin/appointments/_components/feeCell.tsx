// Fee cell shared by the appointments and client-history tables.
function FeeCell({ fee, otherFee }: { fee?: number; otherFee?: number }) {
  if (!fee && !otherFee) {
    return <span className="text-[12px] text-gray-400">No payment</span>;
  }
  return (
    <div>
      {fee ? fee : "-"}
      {otherFee ? (
        <div className="text-[11px] text-gray-500">+ ₹{otherFee} other</div>
      ) : null}
    </div>
  );
}

export default FeeCell;
