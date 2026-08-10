import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Cloud,
  FileUp,
  Filter,
  Home,
  Inbox,
  LayoutGrid,
  ListFilter,
  Mail,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tags,
  WalletCards,
  X,
} from 'lucide-react';
import './styles.css';

const transactions = [
  { id: 'tx-1', merchant: '山姆会员商店', category: '购物', source: 'alipay', amount: 368.00, net: 368.00, time: '今天 12:42', date: '2026-08-06', status: '已入账', accent: 'orange', note: '家庭补给' },
  { id: 'tx-2', merchant: '滴滴出行', category: '交通', source: 'wechat', amount: 42.50, net: 42.50, time: '今天 09:18', date: '2026-08-06', status: '已入账', accent: 'green', note: '通勤' },
  { id: 'tx-3', merchant: '网易云音乐', category: '娱乐', source: 'alipay', amount: 15.00, net: 0, time: '昨天 20:11', date: '2026-08-05', status: '已退款', accent: 'red', note: '会员自动续费' },
  { id: 'tx-4', merchant: '盒马鲜生', category: '餐饮', source: 'wechat', amount: 126.80, net: 86.80, time: '昨天 18:36', date: '2026-08-05', status: '部分退款', accent: 'yellow', note: '缺货退款 ¥40.00' },
  { id: 'tx-5', merchant: 'Apple.com/bill', category: '订阅', source: 'alipay', amount: 68.00, net: 68.00, time: '08月04日 08:00', date: '2026-08-04', status: '已入账', accent: 'blue', note: '云存储' },
  { id: 'tx-6', merchant: '瑞幸咖啡', category: '餐饮', source: 'wechat', amount: 19.90, net: 19.90, time: '08月03日 10:23', date: '2026-08-03', status: '已入账', accent: 'brown', note: '生椰拿铁' },
];

const navItems = [
  { id: 'dashboard', label: '首页', icon: Home },
  { id: 'transactions', label: '流水', icon: WalletCards },
  { id: 'imports', label: '导入', icon: FileUp },
  { id: 'rules', label: '规则', icon: Tags },
  { id: 'settings', label: '设置', icon: Settings },
];

const sourceLabel = { alipay: '支付宝', wechat: '微信' };

function formatMoney(value) {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTx, setSelectedTx] = useState(null);
  const [sourceFilter, setSourceFilter] = useState('全部来源');
  const [query, setQuery] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  const filteredTransactions = useMemo(() => transactions.filter((tx) => {
    const matchesSource = sourceFilter === '全部来源' || sourceLabel[tx.source] === sourceFilter;
    const matchesQuery = !query || `${tx.merchant}${tx.category}${tx.note}`.toLowerCase().includes(query.toLowerCase());
    return matchesSource && matchesQuery;
  }), [query, sourceFilter]);

  const go = (tab) => setActiveTab(tab);

  return (
    <div className="app-shell">
      <aside className="side-rail">
        <div className="brand-lockup">
          <div className="brand-mark"><Sparkles size={17} strokeWidth={2.5} /></div>
          <div>
            <div className="brand-name">账流</div>
            <div className="brand-subtitle">PERSONAL LEDGER</div>
          </div>
        </div>
        <div className="rail-section-label">工作台</div>
        <nav className="rail-nav">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`rail-link ${activeTab === id ? 'active' : ''}`} onClick={() => go(id)}>
              <Icon size={18} />
              <span>{label}</span>
              {id === 'transactions' && <span className="rail-count">6</span>}
            </button>
          ))}
        </nav>
        <div className="rail-bottom">
          <div className="sync-rail-card">
            <div className="sync-card-top"><span className="live-dot" /> 同步正常</div>
            <div className="sync-card-time">上次更新 2 分钟前</div>
            <button className="quiet-button" onClick={() => setActiveTab('settings')}><RefreshCw size={14} /> 检查连接</button>
          </div>
          <div className="profile-row">
            <div className="avatar">林</div>
            <div className="profile-copy"><strong>林先生</strong><span>本机账本</span></div>
            <MoreHorizontal size={17} className="muted-icon" />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <span className="mobile-brand-mark"><Sparkles size={14} /></span>
            <div>
              <div className="eyebrow">个人资金看板 / 2026年08月</div>
              <h1>{navItems.find((item) => item.id === activeTab)?.label}</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="sync-pill"><span className="live-dot" /> <span>自动同步中</span></div>
            <button className="icon-button" title="通知"><Bell size={18} /></button>
            <button className="avatar small">林</button>
          </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard onSelect={setSelectedTx} onNavigate={go} />}
        {activeTab === 'transactions' && (
          <TransactionsPage
            transactions={filteredTransactions}
            query={query}
            setQuery={setQuery}
            sourceFilter={sourceFilter}
            setSourceFilter={setSourceFilter}
            onSelect={setSelectedTx}
          />
        )}
        {activeTab === 'imports' && <ImportsPage onOpenImport={() => setShowImport(true)} />}
        {activeTab === 'rules' && <RulesPage />}
        {activeTab === 'settings' && (
          <SettingsPage
            syncEnabled={syncEnabled}
            setSyncEnabled={setSyncEnabled}
            notificationEnabled={notificationEnabled}
            setNotificationEnabled={setNotificationEnabled}
          />
        )}
      </main>

      <nav className="bottom-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => go(id)}>
            <Icon size={19} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {selectedTx && <TransactionDrawer transaction={selectedTx} onClose={() => setSelectedTx(null)} />}
      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
    </div>
  );
}

function Dashboard({ onSelect, onNavigate }) {
  return (
    <div className="page-content dashboard-page">
      <div className="dashboard-intro">
        <div>
          <p className="section-kicker">月度概览 <span className="green-text">● 数据已更新</span></p>
          <h2>这个月，花得比上月少 <span className="red-text">12.4%</span></h2>
        </div>
        <button className="outline-button" onClick={() => onNavigate('transactions')}><ListFilter size={16} /> 查看全部流水</button>
      </div>

      <section className="metric-grid">
        <MetricCard label="本月净支出" value="¥4,286.30" delta="较上月 -12.4%" tone="cyan" icon={<ArrowDownLeft size={17} />} />
        <MetricCard label="原始支出" value="¥4,872.50" delta="共 38 笔交易" tone="red" icon={<ArrowUpRight size={17} />} />
        <MetricCard label="已退款" value="¥586.20" delta="6 笔已匹配" tone="green" icon={<RefreshCw size={17} />} />
        <MetricCard label="待确认" value="3 笔" delta="需要你的判断" tone="yellow" icon={<CircleAlert size={17} />} />
      </section>

      <section className="dashboard-grid">
        <div className="panel trend-panel">
          <PanelHeader title="净支出趋势" meta="近 30 天" action={<button className="select-button">近 30 天 <ChevronDown size={14} /></button>} />
          <div className="chart-wrap">
            <div className="chart-y-labels"><span>¥500</span><span>¥300</span><span>¥100</span><span>¥0</span></div>
            <div className="chart-area">
              <div className="chart-gridline one" /><div className="chart-gridline two" /><div className="chart-gridline three" /><div className="chart-gridline four" />
              <svg className="line-chart" viewBox="0 0 620 210" preserveAspectRatio="none" aria-label="净支出趋势图">
                <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#5ee0d0" stopOpacity=".28" /><stop offset="100%" stopColor="#5ee0d0" stopOpacity="0" /></linearGradient></defs>
                <path d="M0 172 C30 168, 42 142, 68 150 S107 178, 135 136 S167 105, 191 134 S219 159, 250 118 S286 94, 310 119 S345 167, 374 118 S411 87, 440 108 S468 148, 495 101 S526 73, 550 89 S584 74, 620 47 L620 210 L0 210 Z" fill="url(#chartFill)" />
                <path d="M0 172 C30 168, 42 142, 68 150 S107 178, 135 136 S167 105, 191 134 S219 159, 250 118 S286 94, 310 119 S345 167, 374 118 S411 87, 440 108 S468 148, 495 101 S526 73, 550 89 S584 74, 620 47" fill="none" stroke="#5ee0d0" strokeWidth="3" strokeLinecap="round" />
                <circle cx="620" cy="47" r="5" fill="#0a0e13" stroke="#5ee0d0" strokeWidth="3" />
              </svg>
              <div className="chart-x-labels"><span>07/08</span><span>07/15</span><span>07/22</span><span>07/29</span><span>08/06</span></div>
            </div>
          </div>
        </div>
        <div className="panel category-panel">
          <PanelHeader title="支出分布" meta="按分类" action={<button className="icon-button small-icon"><MoreHorizontal size={17} /></button>} />
          <div className="donut-area">
            <div className="donut"><div className="donut-center"><strong>¥4,286</strong><span>净支出</span></div></div>
            <div className="legend-list">
              <LegendItem color="#e87345" label="购物" value="¥1,420" percent="33%" />
              <LegendItem color="#5ee0d0" label="餐饮" value="¥986" percent="23%" />
              <LegendItem color="#f2bd67" label="交通" value="¥708" percent="16%" />
              <LegendItem color="#8c98a8" label="其他" value="¥1,172" percent="28%" />
            </div>
          </div>
        </div>
      </section>

      <section className="panel recent-panel">
        <PanelHeader title="最近流水" meta="按发生时间排序" action={<button className="text-button" onClick={() => onNavigate('transactions')}>全部流水 <ChevronRight size={15} /></button>} />
        <div className="transaction-list compact-list">
          {transactions.slice(0, 4).map((tx) => <TransactionRow key={tx.id} transaction={tx} onSelect={onSelect} />)}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, delta, tone, icon }) {
  return <div className={`metric-card ${tone}`}><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><strong>{value}</strong><div className="metric-delta">{delta}</div></div>;
}

function PanelHeader({ title, meta, action }) {
  return <div className="panel-header"><div><h3>{title}</h3>{meta && <span>{meta}</span>}</div>{action}</div>;
}

function LegendItem({ color, label, value, percent }) {
  return <div className="legend-item"><span className="legend-label"><i style={{ background: color }} />{label}</span><span><strong>{value}</strong><em>{percent}</em></span></div>;
}

function TransactionsPage({ transactions: filtered, query, setQuery, sourceFilter, setSourceFilter, onSelect }) {
  const options = ['全部来源', '支付宝', '微信'];
  return <div className="page-content">
    <div className="page-toolbar"><div><p className="section-kicker">流水总览</p><h2>全部交易 <span className="sub-count">38 笔</span></h2></div><button className="primary-button"><Plus size={16} /> 手动记一笔</button></div>
    <div className="filters-row"><div className="search-input"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索商户、分类或备注" /></div><div className="source-filters">{options.map((option) => <button key={option} className={sourceFilter === option ? 'active' : ''} onClick={() => setSourceFilter(option)}>{option}</button>)}</div><button className="filter-button"><Filter size={16} /> 筛选</button></div>
    <div className="transaction-table-wrap"><div className="table-heading"><span>交易信息</span><span>来源</span><span>状态</span><span>实际支出</span></div><div className="transaction-list">{filtered.length ? filtered.map((tx) => <TransactionRow key={tx.id} transaction={tx} onSelect={onSelect} detailed />) : <EmptyState text="没有找到匹配的流水" />}</div></div>
  </div>;
}

function TransactionRow({ transaction: tx, onSelect, detailed = false }) {
  return <button className={`transaction-row ${detailed ? 'detailed' : ''}`} onClick={() => onSelect(tx)}>
    <div className="transaction-main"><div className={`merchant-icon ${tx.accent}`}>{tx.merchant.slice(0, 1)}</div><div className="transaction-copy"><strong>{tx.merchant}</strong><span>{tx.category} · {tx.time}{tx.note ? ` · ${tx.note}` : ''}</span></div></div>
    {detailed && <div className={`source-badge ${tx.source}`}>{sourceLabel[tx.source]}</div>}
    {detailed && <div className={`status-badge ${tx.status === '已退款' ? 'refund' : tx.status === '部分退款' ? 'partial' : 'paid'}`}>{tx.status}</div>}
    <div className="transaction-amount"><strong className={tx.net === 0 ? 'refund-amount' : ''}>{tx.net === 0 ? '已退款' : `-¥${formatMoney(tx.net)}`}</strong>{tx.net !== tx.amount && <span>原 ¥{formatMoney(tx.amount)}</span>}</div><ChevronRight size={15} className="row-chevron" />
  </button>;
}

function ImportsPage({ onOpenImport }) {
  return <div className="page-content">
    <div className="page-toolbar"><div><p className="section-kicker">历史补录与校对</p><h2>账单导入</h2></div><button className="primary-button" onClick={onOpenImport}><FileUp size={16} /> 导入账单</button></div>
    <div className="import-hero"><div className="import-icon"><FileUp size={22} /></div><div><h3>把历史账单交给账流</h3><p>支持微信、支付宝导出的 Excel / CSV 文件。导入前会先预览字段并自动识别退款。</p></div><button className="outline-button" onClick={onOpenImport}>选择文件 <ChevronRight size={15} /></button></div>
    <div className="import-grid"><ImportSourceCard source="微信账单" icon="微" detail="最近导入：今天 14:12" count="1,248" tone="wechat" /><ImportSourceCard source="支付宝账单" icon="支" detail="最近导入：昨天 19:30" count="2,684" tone="alipay" /></div>
    <section className="panel batch-panel"><PanelHeader title="最近批次" meta="可撤销最近一次导入" action={<button className="text-button">查看全部 <ChevronRight size={15} /></button>} /><div className="batch-row"><div className="file-symbol"><FileUp size={17} /></div><div><strong>alipay_2026-08.xlsx</strong><span>2,684 条记录 · 6 条退款</span></div><span className="batch-status">已完成</span><button className="icon-button"><MoreHorizontal size={17} /></button></div></section>
  </div>;
}

function ImportSourceCard({ source, icon, detail, count, tone }) {
  return <div className="import-source-card"><div className={`source-logo ${tone}`}>{icon}</div><div><strong>{source}</strong><span>{detail}</span></div><div className="import-count"><strong>{count}</strong><span>已入账</span></div><ChevronRight size={16} className="muted-icon" /></div>;
}

function RulesPage() {
  return <div className="page-content"><div className="page-toolbar"><div><p className="section-kicker">自动化设置</p><h2>分类规则</h2></div><button className="primary-button"><Plus size={16} /> 新建规则</button></div><div className="rule-summary"><div><span>已启用规则</span><strong>12</strong></div><div><span>本月自动分类</span><strong>94.6%</strong></div><div><span>待确认商户</span><strong className="yellow-text">3</strong></div></div><section className="panel rules-panel"><PanelHeader title="商户分类规则" meta="优先级从上到下" action={<button className="icon-button small-icon"><SlidersHorizontal size={17} /></button>} /><RuleRow keyword="山姆会员" category="购物" hits="本月命中 4 次" /><RuleRow keyword="滴滴" category="交通" hits="本月命中 8 次" /><RuleRow keyword="瑞幸" category="餐饮" hits="本月命中 11 次" /><RuleRow keyword="Apple.com" category="订阅" hits="本月命中 2 次" /></section></div>;
}

function RuleRow({ keyword, category, hits }) { return <div className="rule-row"><div className="drag-dots">⋮⋮</div><div className="rule-copy"><strong>商户包含 “{keyword}”</strong><span>{hits}</span></div><span className="category-chip">{category}</span><button className="icon-button"><MoreHorizontal size={17} /></button></div>; }

function SettingsPage({ syncEnabled, setSyncEnabled, notificationEnabled, setNotificationEnabled }) {
  return <div className="page-content"><div className="page-toolbar"><div><p className="section-kicker">连接与隐私</p><h2>设置</h2></div></div><section className="panel settings-panel"><PanelHeader title="数据源连接" meta="只接收必要的交易字段" action={<ShieldCheck size={18} className="green-text" />} /><SettingRow icon={<Mail size={18} />} title="交易邮件同步" detail="iPhone 与 Android 通用 · 上次同步 2 分钟前" enabled={syncEnabled} onChange={setSyncEnabled} /><SettingRow icon={<Bell size={18} />} title="Android 通知监听" detail="读取微信、支付宝的支付与退款通知" enabled={notificationEnabled} onChange={setNotificationEnabled} androidOnly /><SettingRow icon={<Cloud size={18} />} title="云端原文缓存" detail="解析后 24 小时自动清除" enabled={true} locked /></section><section className="panel settings-panel"><PanelHeader title="本地数据" meta="账本主数据保存在本机" /><button className="setting-action"><Inbox size={18} /><span><strong>导出本地账本</strong><small>生成 Excel 文件保存到本机</small></span><ChevronRight size={16} /></button><button className="setting-action"><ShieldCheck size={18} /><span><strong>隐私与权限说明</strong><small>查看数据采集和删除规则</small></span><ChevronRight size={16} /></button></section></div>;
}

function SettingRow({ icon, title, detail, enabled, onChange, androidOnly, locked }) { return <div className="setting-row"><div className="setting-icon">{icon}</div><div className="setting-copy"><strong>{title}{androidOnly && <em>Android</em>}</strong><span>{detail}</span></div>{locked ? <span className="locked-label">受保护</span> : <button className={`switch ${enabled ? 'on' : ''}`} onClick={() => onChange(!enabled)} aria-label={`切换${title}`}><span /></button>}</div>; }

function TransactionDrawer({ transaction: tx, onClose }) {
  return <div className="drawer-backdrop" onClick={onClose}><aside className="transaction-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><span className="section-kicker">流水详情</span><h2>{tx.merchant}</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div><div className="drawer-amount"><span>实际计入总账</span><strong className={tx.net === 0 ? 'green-text' : ''}>{tx.net === 0 ? '¥0.00' : `¥${formatMoney(tx.net)}`}</strong>{tx.net !== tx.amount && <em>原支出 ¥{formatMoney(tx.amount)} · 已退 ¥{formatMoney(tx.amount - tx.net)}</em>}</div><div className="detail-status"><span className={`status-badge ${tx.status === '已退款' ? 'refund' : tx.status === '部分退款' ? 'partial' : 'paid'}`}>{tx.status}</span><span className={`source-badge ${tx.source}`}>{sourceLabel[tx.source]}</span></div><div className="detail-list"><DetailItem label="发生时间" value={tx.date + ' ' + tx.time.replace('今天 ', '').replace('昨天 ', '')} /><DetailItem label="分类" value={tx.category} /><DetailItem label="备注" value={tx.note || '未填写'} /><DetailItem label="同步来源" value={tx.source === 'alipay' ? '交易邮件解析' : 'Android 通知监听'} /></div><div className="refund-timeline"><div className="timeline-title"><RefreshCw size={16} /> 退款链路</div><div className="timeline-item"><span className="timeline-dot paid-dot" /><div><strong>支付成功</strong><span>{tx.time} · ¥{formatMoney(tx.amount)}</span></div></div>{tx.net !== tx.amount && <div className="timeline-item"><span className="timeline-dot refund-dot" /><div><strong>{tx.status}</strong><span>自动匹配 · ¥{formatMoney(tx.amount - tx.net)}</span></div></div>}</div><button className="outline-button drawer-action">编辑分类与备注</button></aside></div>;
}

function DetailItem({ label, value }) { return <div className="detail-item"><span>{label}</span><strong>{value}</strong></div>; }

function ImportModal({ onClose }) {
  const [stage, setStage] = useState('select');
  return <div className="modal-backdrop" onClick={onClose}><div className="import-modal" onClick={(event) => event.stopPropagation()}>{stage === 'select' ? <><div className="modal-header"><div><span className="section-kicker">导入历史流水</span><h2>选择账单文件</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div><div className="drop-zone" onClick={() => setStage('preview')}><div className="drop-icon"><FileUp size={24} /></div><strong>点击选择或拖入文件</strong><span>支持 .xlsx、.xls、.csv，单个文件最大 20MB</span></div><div className="modal-note"><CircleAlert size={15} /> 导入前会先预览字段，不会立即改变总账。</div></> : <><div className="modal-header"><div><span className="section-kicker">第 1 步 / 第 2 步</span><h2>确认字段映射</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div><div className="file-preview"><div className="file-symbol"><FileUp size={18} /></div><div><strong>wechat_账单_2026.xlsx</strong><span>1,248 行 · 检测到 14 条退款</span></div><span className="green-text">可导入</span></div><div className="mapping-list"><MappingRow from="交易时间" to="发生时间" /><MappingRow from="交易对方" to="商户名称" /><MappingRow from="金额" to="支付金额" /><MappingRow from="交易状态" to="状态" /></div><button className="primary-button full-button" onClick={() => setStage('done')}><Sparkles size={16} /> 开始导入</button></>}{stage === 'done' && <div className="modal-success"><div className="success-check">✓</div><h2>导入完成</h2><p>1,234 条已入账，14 条退款已匹配。</p><button className="primary-button" onClick={onClose}>返回导入中心</button></div>}</div></div>;
}

function MappingRow({ from, to }) { return <div className="mapping-row"><span>{from}</span><ChevronRight size={14} /><strong>{to}</strong><span className="mapping-ok">已识别</span></div>; }
function EmptyState({ text }) { return <div className="empty-state"><Search size={22} /><span>{text}</span></div>; }

createRoot(document.getElementById('root')).render(<App />);
