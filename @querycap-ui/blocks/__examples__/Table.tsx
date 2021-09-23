import { Stack } from "@querycap-ui/layouts";
import { Table, ITableColumn } from "../Table";

export const Tables = () => {
  const dataSource = [
    {
      key: "1",
      name: "胡彦斌",
      age: 32,
      address1: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address2: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address3: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address4: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address5: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
    },
    {
      key: "1",
      name: "胡彦斌",
      age: 32,
      address1: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address2: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address3: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address4: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address5: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
    },
    {
      key: "2",
      name: "胡彦祖",
      age: 42,
      address1: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address2: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address3: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address4: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address5: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
    },
    {
      key: "3",
      name: "周星驰",
      age: 12,
      address1: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address2: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address3: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address4: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
      address5: "西湖区湖底公园1号 New York No. 1 Lake Park, New York No. 1 Lake Park",
    },
  ];

  const columns: ITableColumn<typeof dataSource[0]>[] = [
    {
      title: "姓名",
      key: "name",
      width: 100,
      sticky: "left",
    },
    {
      title: "年龄",
      key: "age",
      width: 100,
      sticky: "left",
    },
    {
      title: "住址1",
      key: "address1",
      ellipsis: true,
      width: 300,
    },
    {
      title: "住址2",
      key: "address2",
      ellipsis: true,
      width: 300,
    },
    {
      title: "住址3",
      key: "address3",
      ellipsis: true,
      width: 300,
    },
    {
      title: "住址4",
      key: "address4",
      ellipsis: true,
      width: 300,
    },
    {
      title: "住址5",
      key: "address5",
      ellipsis: true,
      width: 300,
    },
    {
      title: "操作",
      key: "action",
      sticky: "right",
      width: 200,
      formatter: (_: any, record: any) => (
        <Stack inline spacing={10}>
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Stack>
      ),
    },
  ];

  return (
    <Stack>
      <Table tableLayout={"fixed"} rowKey={"key"} columns={columns} dataSource={dataSource} />
      <Table rowKey={"key"} columns={columns} dataSource={[]} />
      <Table tableLayout={"fixed"} rowKey={"key"} columns={columns} dataSource={[]} loading />
    </Stack>
  );
};
