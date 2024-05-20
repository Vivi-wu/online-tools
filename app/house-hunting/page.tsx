"use client";
import { Table, Button, Input, Space, Popconfirm, Alert, TableColumnType, TableProps } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { ROOM_SOURCE_MAP, RoomData, RoomDataIndex, demoData, downloadJSON } from '../ui/house-hunting/utils';
import AddRoomModal from '@/ui/house-hunting/AddRoomModal';
import EditRoomModal from '@/ui/house-hunting/EditRoomModal';
import Highlighter from 'react-highlight-words';
import './HouseHuntingPage.css';

const isSmallDevice = typeof window === 'undefined' ? false : window.matchMedia('(max-width: 767px)').matches;

function HouseHuntingPage() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: RoomDataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex: RoomDataIndex): TableColumnType<RoomData> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{ padding: 8 }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >搜索</Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >重置</Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >关闭</Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        style={{ color: filtered ? '#1890ff' : undefined }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes((value as string).toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const [roomData, setRoomData] = useState(demoData);
  // 更新房间数据状态
  const onSetData = (values: RoomData[]) => {
    setRoomData(values);
    localStorage.setItem('room_data', JSON.stringify(values))
  }
  useEffect(() => {
    const tmpVal = localStorage.getItem('room_data')
    if (tmpVal) {
      setRoomData(JSON.parse(tmpVal))
    }
  }, [])

  // 删除
  const handleDelete = (index: number) => {
    onSetData(roomData.filter((d, i) => i!== index));
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const [openAdd, setOpenAdd] = useState(false);
  // 添加
  const handleCreate = (values: RoomData) => {
    onSetData([...roomData, { ...values, id: roomData.length + 1 }])
    setOpenAdd(false)
  };

  const [openEdit, setOpenEdit] = useState(false);
  const [formData, setFormData] = useState<RoomData>(null as any);
  const [editId, setEditId] = useState(-1);
  const handleClickEdit = (record: RoomData) => {
    setFormData(record)
    setEditId(record.id)
    setOpenEdit(true)
  };

  // 更新编辑后的数据
  const handleUpdate = (values: RoomData) => {
    const newData = roomData.map(d => {
      if (d.id === editId) {
        return values;
      } else {
        return d;
      }
    });
    onSetData(newData)
    setOpenEdit(false)
  };

  const tableColumns: TableProps<RoomData>['columns'] = [
    {
      title: '详细地址',
      dataIndex: 'address',
      fixed: isSmallDevice ? false : 'left',
      width: 230,
      ...getColumnSearchProps('address'),
    },
    {
      title: '房源No.',
      dataIndex: 'roomNo',
      width: 75,
      render: (text: string) => <>#{text}</>,
    },
    {
      title: '月租总价',
      dataIndex: 'total',
      width: 95,
      render: (text: string) => <>{text}元</>,
      sorter: {
        compare: (a: RoomData, b: RoomData) => Number(a.total) - Number(b.total),
        multiple: 2,
      },
    },
    {
      title: '通勤时间',
      dataIndex: 'commuteTime',
      width: 95,
      render: (text: string) => <>{text ? text + '分钟' : '-' }</>,
      sorter: {
        compare: (a: RoomData, b: RoomData) => Number(a.commuteTime) - Number(b.commuteTime),
        multiple: 1,
      },
    },
    {
      title: '租房成本',
      children: [
        {
          title: '月租金',
          dataIndex: 'monthlyRent',
          width: 110,
          render: (text: string) => <>{text}元</>,
        },
        {
          title: '生活缴费',
          dataIndex: 'livingExpenses',
          width: 220,
        },
        {
          title: '其他费用',
          dataIndex: 'serviceCost',
          width: 85,
        },
      ]
    },
    {
      title: '中介费',
      dataIndex: 'intermediaryFees',
      width: 85,
    },
    {
      title: '朝向',
      dataIndex: 'facing',
      width: 80,
    },
    {
      title: '面积(㎡)',
      dataIndex: 'area',
      width: 80,
    },
    {
      title: '卫生间',
      dataIndex: 'bathroom',
      width: 130,
    },
    {
      title: '厨房',
      dataIndex: 'kitchen',
      width: 120,
    },
    {
      title: '阳台',
      dataIndex: 'balcony',
      width: 110,
    },
    {
      title: '周边',
      dataIndex: 'surrounding',
      width: 220,
      className: 'white-space-normal'
    },
    {
      title: '链接',
      dataIndex: 'link',
      width: 150,
      ellipsis: true,
      render: (text: string) => <a href={text} target="_blank" rel="noreferrer">{text}</a>,
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 100,
      render: (text: number) => {
        const val = ROOM_SOURCE_MAP.find(d => d.value === text)
        return val ? val.label : text
      },
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: '备注',
      dataIndex: 'note',
      width: 300,
      className: 'white-space-normal'
    },
    {
      title: '操作',
      key: 'operation',
      fixed: isSmallDevice ? false : 'right',
      width: 85,
      className: 'td-action',
      render: (_: any, record: RoomData, index: number) => <>
        <Button type='link' icon={<EditOutlined />} onClick={() => handleClickEdit(record)} />
        <Popconfirm
          title="确定要删除这行数据吗?"
          onConfirm={() => handleDelete(index)}
          placement="topLeft"
          okText="是的"
          cancelText="算了，先不删"
        >
          <Button type='text' danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </>,
    }
  ];

  // 从JSON文件导入数据
  const handleJsonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files? e.target.files[0] : null;
    if (!file) return 
    if (file.type !== 'application/json') {
        alert("请选择一个JSON文件");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      if (!e.target) return;
        try {
            const tmpVal = e.target.result as string
            localStorage.setItem('room_data', tmpVal)
            setRoomData(JSON.parse(tmpVal))
        } catch (err) {
            console.error("解析JSON时发生错误:", err);
        }
    };
    reader.readAsText(file);
  }

  return (<>
    { isSmallDevice ? <Alert message="请在电脑端打开，或将设备转为横屏模式使用，以获得更好的使用体验" banner /> : null }
    <div className="root-container">
      <Space size='middle' style={{ marginBottom: '24px'}}>
        <Button
          type='primary'
          size='large'
          icon={<PlusOutlined />}
          onClick={() => setOpenAdd(true)}
        >新增</Button>
        { roomData.length ? <>
          <Button
            size='large'
            icon={<DownloadOutlined />}
            onClick={() => downloadJSON(roomData, '房源数据.json')}
          >下载JSON数据</Button>
          <input type="file" accept=".json" onChange={handleJsonFileChange} />
          {/* <Button
            size='large'
            icon={<DownloadOutlined />}
            onClick={() => exportFile(roomData)}
          >导出xlsx文件</Button> */}
        </> : null }
      </Space>
      <Table
        id='house-hunting-table'
        rowKey='id'
        columns={tableColumns}
        dataSource={roomData}
        bordered
        scroll={{ x: 2000 }}
        rowSelection={{
          selectedRowKeys,
          hideSelectAll: true,
          onChange: onSelectChange
        }}
        pagination={{
          hideOnSinglePage: true
        }}
      />
      <AddRoomModal
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onCreate={handleCreate}
        tableData={roomData}
      />
      <EditRoomModal
        open={openEdit}
        initialData={formData}
        onCancel={() => setOpenEdit(false)}
        onUpdate={handleUpdate}
        tableData={roomData}
      />
    </div>
  </>);
}

export default HouseHuntingPage;
