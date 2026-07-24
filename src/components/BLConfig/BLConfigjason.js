export const BLConfigData = {
  属性: {
    title: '基本属性',
    data: [
      {
        type: 'input',
        label: '型号',
        value: 'XXXX车'
      },
      {
        type: 'input',
        label: '名称',
        value: '冰粒1'
      },
      {
        type: 'input',
        label: '经度',
        value: '80.8745638'
      },
      {
        type: 'input',
        label: '纬度',
        value: '37.8794534'
      },
      {
        type: 'input',
        label: '上级',
        value: 'XXX'
      },
      {
        type: 'input',
        label: '目标',
        value: '完成XXXX目标'
      },
      {
        type: 'select',
        label: '型号',
        value: 'XXX规范',
        option: [{ data: 'XXX规则' }]
      }
    ]
  },
  通信: {
    // tableHeader: [
    //   { prop: 'comObject', label: '通信对象' },
    //   { prop: 'channel', label: '频道' }
    // ],
    tableHeader: [
      { prop: 'Name', label: '名称' },
      { prop: 'Type', label: '类型' },
      { prop: 'MaxRange', label: '最大范围' },
      { prop: 'MinRange', label: '最小范围' }
    ],
    tableData: [
      { comObject: 'XXX', channel: '121' },
      { comObject: 'XXX', channel: '123' }
    ]
  },
  下属: {
    tableHeader: [{ prop: 'comObject', label: 'BL名称' }],
    tableData: [
      { comObject: '冰粒1' },
      { comObject: '冰粒2' },
      { comObject: '冰粒3' },
      { comObject: '冰粒4' },
      { comObject: '冰粒5' },
      { comObject: '冰粒6' },
      { comObject: '冰粒7' }
    ]
  },
  路径: {
    selectLabel: '选择路线',
    option: [
      {
        value: '1',
        label: '路线1'
      }
    ],
    tableHeader: [
      { prop: 'stamp', label: '持续时间(秒)', width: '120px' },
      { prop: 'speed', label: '速度(Km/h)', width: '120px' }
    ],
    tableData: []
  },
  航线: {
    selectLabel: '选择航线',
    option: [
      {
        value: '1',
        label: '航线1'
      }
    ],
    tableHeader: [
      { prop: 'stamp', label: '持续时间(秒)', width: '120px' },
      { prop: 'speed', label: '速度(Km/h)', width: '120px' }
    ],
    tableData: []
  }
}
