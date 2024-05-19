import { utils, writeFileXLSX } from 'xlsx';

export const demoData = [
  {
    roomNo: 1,
    address: 'xx小区x幢/x号楼-房间号',
    monthlyRent: 'xxxx',
    livingExpenses: '民用电费均摊，平均约xxx元',
    serviceCost: '',
    total: 'xxxx',
    commuteTime: 'xx',
    intermediaryFees: '',
    facing: '南',
    area: 'xx',
    bathroom: 'x人共用',
    kitchen: '明厨，新冰箱',
    balcony: '独立阳台',
    surrounding: '步行x分钟至地铁口、x分钟到公交站，大型商超，三甲医院',
    link: 'https://rent-decision.com/xxx',
    source: 0,
    phone: '1xxxxxxxxxx',
    note: '月租金包含水、网、物业、宽带、燃气、保洁费',
  }
];

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

export const ROOM_SOURCE_MAP = [
  { label: '房东直租', value: 0 },
  { label: '链家', value: 1 },
  { label: '贝壳', value: 2 },
  { label: '我爱我家', value: 3 },
  { label: '小红书中介', value: 4 },
  { label: '咸鱼中介', value: 5 },
  { label: '豆瓣小组中介', value: 6 },
  { label: '自如', value: 7 },
  { label: '个人转租', value: 8 },
  { label: '其他', value: 9 },
];

export function exportFile(data) {
  let printData = data.slice(0);
  // 数值的文案映射
  const roomSourceObj = ROOM_SOURCE_MAP.reduce((prev, cur) => {
    prev[cur.value] = cur.label
    return prev
  }, {});
  printData.forEach(e => {
    e.source = roomSourceObj[e.source]
  });
  
  // 表头的文案映射
  const headersArry = Object.keys(data[0]).map(h => exportSheetHeaderObj[h])
  let worksheet = utils.json_to_sheet(printData);
  utils.sheet_add_aoa(worksheet, [headersArry], { origin: "A1" });
  
  // 设置表头最小宽度，一个中文对应2个字符/character宽度
  const max_width = headersArry.reduce((w, h) => Math.max(w, h.length), 1);
  worksheet["!cols"] = headersArry.map(h => ({ wch: max_width * 2 }));

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "房源信息");
  writeFileXLSX(workbook, "租房.xlsx");
}
