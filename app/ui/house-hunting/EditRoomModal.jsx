import { Form } from 'antd';
import { useEffect } from 'react';
import CommonFormModal from './CommonRoomModal';

export default function EditRoomModal({ open, initialData, onUpdate, onCancel, tableData }) {

  const [form] = Form.useForm();
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields()
        onUpdate(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      })
  }

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialData)
    }
  }, [open])

  return <CommonFormModal
    title='编辑房源信息'
    open={open}
    onOk={handleOk}
    onCancel={onCancel}
    form={form}
    tableData={tableData}
  />
}
