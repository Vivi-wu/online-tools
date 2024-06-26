import { Input, Modal, Form, Select, AutoComplete } from 'antd';
import { useState, useEffect } from 'react';
import { ROOM_SOURCE_MAP } from './utils';
const { TextArea } = Input;

export default function CommonFormModal({ title, open, onOk, onCancel, form, tableData }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const options = tableData.map(d => ({ value: String(d.roomNo) }))
    setOptions(options)
  }, [tableData])

  const onSelect = (data) => {
    const tmpVal = tableData.find(d => d.roomNo === data)
    // 用已有数据自动填充表单
    if (tmpVal) {
      form.setFieldsValue(tmpVal)
    }
  };

  return (
    <Modal
      title={title}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="保存"
      cancelText="取消"
    >
      <Form
        form={form}
        layout={'vertical'}
      >
        <Form.Item label='房源No.' name='roomNo'>
          <AutoComplete
            options={options}
            onSelect={onSelect}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            allowClear
            placeholder='可以选择已有的房源编号进行快速填写'
          />
        </Form.Item>
        <Form.Item label='详细地址' name='address'>
          <Input allowClear />
        </Form.Item>
        <Form.Item label='月租金' name='monthlyRent'>
          <Input allowClear suffix='元' />
        </Form.Item>
        <Form.Item label='生活缴费' name='livingExpenses' extra='每月需固定支出的水、电、网、燃气、物业、保洁费等。若不按照实际水表、电表等计费，建议标注水费x元/吨，电费x元/度'>
          <TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            allowClear
          />
        </Form.Item>
        <Form.Item label='其他费用' name='serviceCost' extra='每月需固定支出的其他费用，如：服务费'>
          <Input allowClear />
        </Form.Item>
        <Form.Item label='月租总价' name='total' extra='月租金+生活缴费+其他费用'>
          <Input allowClear suffix='元' />
        </Form.Item>
        <Form.Item label='通勤时间' name='commuteTime' extra="填最短时间，在备注里写上交通方式">
          <Input allowClear suffix='分钟' />
        </Form.Item>
        <Form.Item label='中介费' name='intermediaryFees'>
          <Input allowClear defaultValue='无' />
        </Form.Item>
        <Form.Item label='朝向' name='facing'>
          <Input allowClear />
        </Form.Item>
        <Form.Item label='面积' name='area'>
          <Input allowClear suffix='㎡' />
        </Form.Item>
        <Form.Item label='卫生间' name='bathroom'>
          <Input allowClear />
        </Form.Item>
        <Form.Item label='厨房' name='kitchen'>
          <Input allowClear />
        </Form.Item>
        <Form.Item label='阳台' name='balcony'>
          <Input allowClear />
        </Form.Item>
        <Form.Item label='周边' name='surrounding'>
          <TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            allowClear
          />
        </Form.Item>
        <Form.Item label='链接' name='link' rules={[{ type: 'url', warningOnly: true, message: '请输入有效的URL链接' }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label='来源' name='source'>
          <Select options={ROOM_SOURCE_MAP} allowClear />
        </Form.Item>
        <Form.Item label='联系方式' name='phone'>
          <Input allowClear />
        </Form.Item>
        <Form.Item label='备注' name='note'>
          <TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}