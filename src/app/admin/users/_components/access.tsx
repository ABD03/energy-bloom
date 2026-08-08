import { Checkbox, Form } from "antd";
import DynamicIcon from "@/utils/dynamicIcons";

import Menu from "../../_components/siderBar/menu.json";

const Access = (props: any) => {
  const allIds = Menu.flatMap((section: any) =>
    section.items.map((item: any) => item.id),
  );
  const length = allIds?.length;
  const selectAll = () => {
    if (props?.value?.length === length) {
      props?.selectAll([]);
    } else {
      props?.selectAll(allIds);
    }
  };

  const addAccess = (value: any) => {
    try {
      let arr: any = [...props?.value];
      let check = arr.findIndex((item: any) => item === value?.id);
      if (check >= 0) {
        arr.splice(check, 1);
        props?.select(arr);
      } else {
        arr = Array.from(new Set([...arr, value?.id]));
        props?.select(arr);
      }
      setTimeout(() => {}, 10);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
   <div className="flex items-center mt-4">
        <div className="flex-1 text-[13px]">
          Access ( users manage permissions )
        </div>
        <div className="flex gap-2 pr-1">
          <div>Select all</div>
          <Form.Item noStyle>
            <Checkbox
              onChange={() => selectAll()}
              checked={props?.value?.length === length}
            />
          </Form.Item>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
        {Menu[0]?.items.map((item: any, index: any) => (
          <div key={index} onClick={() => addAccess(item)}>
            <div className="flex items-center gap-2 px-2 py-1.25 border border-gray-200 rounded-sm text-[13px] text-[#424242] bg-white">
              <div>
                <DynamicIcon size={13} name={item?.icon} />
              </div>
              <div className="flex-1">{item?.menu}</div>
              <div>
                <Checkbox checked={props?.value?.includes(item?.id)} />
              </div>
            </div>
          </div>
        ))}
        {Menu[1]?.items.map((item: any, index: any) => (
          <div key={index} onClick={() => addAccess(item)}>
            <div className="flex items-center gap-2 px-2 py-1.25 border border-gray-200 rounded-sm text-[13px] text-[#424242] bg-white">
              <div>
                <DynamicIcon size={13} name={item?.icon} />
              </div>
              <div className="flex-1">{item?.menu}</div>
              <div>
                <Checkbox checked={props?.value?.includes(item?.id)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Access;
