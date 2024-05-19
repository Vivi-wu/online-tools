// import { utils, writeFileXLSX } from 'xlsx';

export interface RoomData {
  roomNo: number,
  address: string,
  monthlyRent: string,
  livingExpenses: string,
  serviceCost: string,
  total: string,
  commuteTime: string,
  intermediaryFees: string,
  facing: string,
  area: string,
  bathroom: string,
  kitchen: string,
  balcony: string,
  surrounding: string,
  link: string,
  source: number,
  phone: string,
  note: string,
}

export type RoomDataIndex = keyof RoomData;

export const demoData: RoomData[] = [
  {
    roomNo: 1,
    address: 'xx小区x幢/x号楼x单元x室',
    monthlyRent: 'xxxx',
    livingExpenses: '民用峰谷电，平均约xx元/月',
    serviceCost: 'x元/月',
    total: 'xxxx',
    commuteTime: 'xx',
    intermediaryFees: 'x元',
    facing: '南',
    area: 'xx',
    bathroom: 'x人共用',
    kitchen: '明厨，新冰箱',
    balcony: '独立阳台',
    surrounding: '步行x分钟至地铁口、x分钟到公交站，商超，医院',
    link: 'https://rent-decision.com/xxx',
    source: 0,
    phone: '某某：1xxxxxxxxxx',
    note: '月租金包含水、网、物业、宽带、燃气、保洁费，电费均摊',
  }
];
// 枚举类型：房源来源
const RoomSourceArr = [
  '房东直租',
  '二房东',
  '链家',
  '贝壳',
  '我爱我家',
  '小红书中介',
  '咸鱼中介',
  '豆瓣小组中介',
  '自如',
  '个人转租',
  '其他',
];
export const ROOM_SOURCE_MAP = RoomSourceArr.map((room: string, index: number) => ({ label: room, value: index }));

const exportSheetHeaderObj = {
  roomNo: '房源编号',
  address: '地址',
  monthlyRent: '月租金（元）',
  livingExpenses: '生活缴费',
  serviceCost: '服务费',
  total: '月租总价（元）',
  commuteTime: '通勤时间（分钟）',
  intermediaryFees: '中介费（元）',
  facing: '朝向',
  area: '面积（㎡）',
  bathroom: '卫生间',
  kitchen: '厨房',
  balcony: '阳台',
  surrounding: '周边',
  link: '链接',
  source: '来源',
  phone: '联系电话',
  note: '备注',
};

// export function exportFile(data) {
//   let printData = data.slice(0);
//   // 数值的文案映射
//   const roomSourceObj = ROOM_SOURCE_MAP.reduce((prev, cur) => {
//     prev[cur.value] = cur.label
//     return prev
//   }, {});
//   printData.forEach(e => {
//     e.source = roomSourceObj[e.source]
//   });
  
//   // 表头的文案映射
//   const headersArry = Object.keys(data[0]).map(h => exportSheetHeaderObj[h])
//   let worksheet = utils.json_to_sheet(printData);
//   utils.sheet_add_aoa(worksheet, [headersArry], { origin: "A1" });
  
//   // 设置表头最小宽度，一个中文对应2个字符/character宽度
//   const max_width = headersArry.reduce((w, h) => Math.max(w, h.length), 1);
//   worksheet["!cols"] = headersArry.map(h => ({ wch: max_width * 2 }));

//   const workbook = utils.book_new();
//   utils.book_append_sheet(workbook, worksheet, "房源信息");
//   writeFileXLSX(workbook, "租房.xlsx");
// }
