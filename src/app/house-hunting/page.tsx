"use client";
import { Table, Button, Input, Space, Popconfirm, Alert } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import './App.css';

function App() {
  const isSmallDevice = window.matchMedia('(max-width: 767px)').matches;
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >搜索</Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >重置</Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >筛选</Button>
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
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
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

  const [data, setData] = useState(demoData);
  const onSetData = (values) => {
    setData(values);
    localStorage.setItem('room_data', JSON.stringify(values))
  }
  useEffect(() => {
    const tmpVal = localStorage.getItem('room_data')
    if (tmpVal) {
      setData(JSON.parse(tmpVal))
    }
  }, [])

  const handleDelete = (index) => {
    let newData = data.slice(0)
    newData.splice(index, 1);
    onSetData(newData);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const [openAdd, setOpenAdd] = useState(false);
  const handleCreate = (values) => {
    onSetData([...data, values])
    setOpenAdd(false)
  };

  const [openEdit, setOpenEdit] = useState(false);
  const [formData, setFormData] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);
  const handleEdit = (record, index) => {
    setFormData(record)
    setEditIndex(index)
    setOpenEdit(true)
  };
  const handleUpdate = (values) => {
    const newData = data.map((d, i) => {
      if (i === editIndex) {
        return values;
      } else {
        return d;
      }
    });
    onSetData(newData)
    setOpenEdit(false)
  };

  const tableColumns = [
    {
      title: '地址',
      dataIndex: 'address',
      fixed: isSmallDevice ? false : 'left',
      width: 230,
      ...getColumnSearchProps('address'),
    },
    {
      title: '房源No.',
      dataIndex: 'roomNo',
      width: 75,
      render: (text) => <>#{text}</>,
    },
    {
      title: '月租总价',
      dataIndex: 'total',
      width: 95,
      render: (text) => <>{text}元</>,
      sorter: {
        compare: (a, b) => a.total - b.total,
        multiple: 2,
      },
    },
    {
      title: '通勤时间',
      dataIndex: 'commuteTime',
      width: 95,
      render: (text) => <>{text}分钟</>,
      sorter: {
        compare: (a, b) => a.commuteTime - b.commuteTime,
        multiple: 1,
      },
    },
    {
      title: '房租/月',
      children: [
        {
          title: '月租金',
          dataIndex: 'monthlyRent',
          width: 85,
          render: (text) => <>{text}元</>,
        },
        {
          title: '生活缴费',
          dataIndex: 'livingExpenses',
          width: 250,
          className: 'unset-white-space'
        },
        {
          title: '服务费',
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
      ...getColumnSearchProps('facing'),
    },
    {
      title: '面积(㎡)',
      dataIndex: 'area',
      width: 80,
    },
    {
      title: '卫生间',
      dataIndex: 'bathroom',
      width: 150,
      className: 'unset-white-space'
    },
    {
      title: '厨房',
      dataIndex: 'kitchen',
      width: 130,
      className: 'unset-white-space'
    },
    {
      title: '阳台',
      dataIndex: 'balcony',
      width: 110,
      className: 'unset-white-space'
    },
    {
      title: '周边',
      dataIndex: 'surrounding',
      width: 220,
      className: 'unset-white-space'
    },
    {
      title: '链接',
      dataIndex: 'link',
      width: 150,
      ellipsis: true,
      render: (text) => <a href={text} target="_blank" rel="noreferrer">{text}</a>,
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 100,
      className: 'unset-white-space',
      render: (text) => {
        const val = ROOM_SOURCE_MAP.find(d => d.value === text)
        return val ? val.label : text
      },
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: '备注',
      dataIndex: 'note',
      width: 300,
      className: 'unset-white-space'
    },
    {
      title: '操作',
      key: 'operation',
      fixed: isSmallDevice ? false : 'right',
      width: 85,
      className: 'td-action',
      render: (_, record, index) => <>
        <Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record, index)} />
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
        { data.length ? <Button
          size='large'
          icon={<DownloadOutlined />}
          onClick={() => exportFile(data)}
        >导出xlsx文件</Button> : null }
      </Space>
      <Table
        rowKey='roomNo'
        columns={tableColumns}
        dataSource={data}
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
        tableData={data}
      />
      <EditRoomModal
        open={openEdit}
        initialData={formData}
        onCancel={() => setOpenEdit(false)}
        onUpdate={handleUpdate}
        tableData={data}
      />
    </div>
  </>);
}

export default App;
