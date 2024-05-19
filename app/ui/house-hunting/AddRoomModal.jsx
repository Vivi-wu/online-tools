import { Form } from 'antd';
import CommonFormModal from './CommonRoomModal';

export default function AddRoomModal({ open, onCreate, onCancel, tableData }) {

  const [form] = Form.useForm();
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields()
        onCreate(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      })
  }

  return <CommonFormModal
    title='添加候选房源'
    open={open}
    onOk={handleOk}
    onCancel={onCancel}
    form={form}
    tableData={tableData}
  />
}