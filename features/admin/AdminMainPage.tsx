'use client';

import { useMemo, useState } from 'react';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { buildAdminDashboardViewModel } from '@/api/admin/dashboard/helpers/dashboardMetrics';
import useAdminDashboardQuery from '@/api/admin/dashboard/hooks/useAdminDashboardQuery';
import AdminDashboardKpiCard from '@/components/admin/dashboard/AdminDashboardKpiCard';
import AdminDashboardPanel from '@/components/admin/dashboard/AdminDashboardPanel';
import AdminTopDestinationsSummary from '@/components/admin/dashboard/AdminTopDestinationsSummary';
import AdminTopToursTable from '@/components/admin/dashboard/AdminTopToursTable';
import AdminShell from '@/components/admin/layout/AdminShell';
import FadeIn from '@/components/common/motion/FadeIn';
import { adminContent } from '@/content/features/admin';
import type { AdminDashboardTimeRange } from '@/types/adminDashboard';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-PH', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function formatKpiValue(value: number, format: 'currency' | 'integer' | 'percent'): string {
  if (format === 'currency') {
    return formatCurrency(value);
  }

  if (format === 'percent') {
    return `${value.toFixed(1)}%`;
  }

  return new Intl.NumberFormat('en-PH', { maximumFractionDigits: 0 }).format(value);
}

function truncateChartLabel(value: string, maxLength = 26): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function DashboardLoadingState() {
  return (
    <>
      <div className='row y-gap-20 pt-40'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className='col-xl-4 col-md-6'>
            <div className='bg-white shadow-2 px-20 py-20 h-full' style={{ borderRadius: 20 }}>
              <div className='rounded-8 bg-light-2' style={{ height: 14, width: '45%' }} />
              <div className='rounded-8 bg-light-2 mt-15' style={{ height: 30, width: '65%' }} />
              <div className='rounded-8 bg-light-2 mt-15' style={{ height: 12, width: '55%' }} />
            </div>
          </div>
        ))}
      </div>

      <div className='row y-gap-20 pt-20'>
        <div className='col-xl-8 col-lg-12'>
          <div className='bg-white shadow-2 px-25 py-20' style={{ borderRadius: 20 }}>
            <div className='rounded-8 bg-light-2' style={{ height: 14, width: 220 }} />
            <div className='rounded-8 bg-light-2 mt-10' style={{ height: 10, width: 280 }} />
            <div className='bg-light-2 mt-20' style={{ height: 360, width: '100%', borderRadius: 16 }} />
          </div>
        </div>
        <div className='col-xl-4 col-lg-12'>
          <div className='bg-white shadow-2 px-25 py-20' style={{ borderRadius: 20 }}>
            <div className='rounded-8 bg-light-2' style={{ height: 14, width: 180 }} />
            <div className='rounded-8 bg-light-2 mt-10' style={{ height: 10, width: 220 }} />
            <div className='rounded-full bg-light-2 mt-25 mx-auto' style={{ height: 220, width: 220 }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminMainPage() {
  const content = adminContent.pages.main;
  const dashboardContent = content.dashboard;
  const [range, setRange] = useState<AdminDashboardTimeRange>(
    dashboardContent.filters.options[0]?.id ?? '90d',
  );
  const [topToursMetric, setTopToursMetric] = useState<'bookings' | 'revenue'>('bookings');
  const dashboardQuery = useAdminDashboardQuery();

  const dashboardView = useMemo(() => {
    if (!dashboardQuery.data) return null;
    return buildAdminDashboardViewModel(dashboardQuery.data, range);
  }, [dashboardQuery.data, range]);

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <FadeIn className='pt-30'>
        <div className='d-flex flex-wrap items-center justify-between x-gap-15 y-gap-15'>
          <div>
            <div className='text-14 text-dark-1' style={{ opacity: 0.72 }}>
              {dashboardContent.filters.rangeLabel}
            </div>
          </div>

          <div
            className='d-flex items-center flex-wrap'
            style={{ columnGap: 10, rowGap: 10 }}
          >
            {dashboardContent.filters.options.map((option) => {
              const active = option.id === range;

              return (
                <button
                  key={option.id}
                  type='button'
                  onClick={() => setRange(option.id)}
                  className='button -sm rounded-200'
                  style={{
                    border: `1px solid ${active ? '#eb662b' : '#E7E6E6'}`,
                    backgroundColor: active ? 'rgba(235, 102, 43, 0.08)' : '#fff',
                    color: active ? '#eb662b' : '#05073c',
                    padding: '8px 14px',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </FadeIn>

      {dashboardQuery.isLoading ? (
        <DashboardLoadingState />
      ) : dashboardQuery.isError ? (
        <FadeIn className='pt-30'>
          <div className='bg-white shadow-2 px-25 py-25' style={{ borderRadius: 20 }}>
            <div className='text-15 text-red-3'>{dashboardContent.messages.loadError}</div>
            <button
              type='button'
              className='button -sm -outline-accent-1 text-accent-1 mt-15'
              onClick={() => dashboardQuery.refetch()}
            >
              {dashboardContent.messages.retry}
            </button>
          </div>
        </FadeIn>
      ) : dashboardView ? (
        <>
          <div className='row y-gap-20 pt-30'>
            {dashboardView.kpis.map((item, index) => (
              <div key={item.id} className='col-xl-4 col-md-6'>
                <FadeIn delay={index * 0.03}>
                  <AdminDashboardKpiCard item={item} valueLabel={formatKpiValue(item.value, item.format)} />
                </FadeIn>
              </div>
            ))}
          </div>

          <div className='row y-gap-20 pt-20'>
            <div className='col-xl-8 col-lg-12'>
              <FadeIn delay={0.05}>
                <AdminDashboardPanel
                  title={dashboardContent.charts.revenueTrend.title}
                  subtitle={dashboardContent.charts.revenueTrend.subtitle}
                >
                  {dashboardView.revenueTrend.length > 0 ? (
                    <div style={{ height: 360 }}>
                      <ResponsiveContainer width='100%' height='100%'>
                        <ComposedChart data={dashboardView.revenueTrend}>
                          <defs>
                            <linearGradient id='adminRevenueGradient' x1='0' y1='0' x2='0' y2='1'>
                              <stop offset='5%' stopColor='#eb662b' stopOpacity={0.28} />
                              <stop offset='95%' stopColor='#eb662b' stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke='#F2F2F2' vertical={false} />
                          <XAxis dataKey='label' tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                          <YAxis
                            yAxisId='left'
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => formatCompactNumber(Number(value))}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            yAxisId='right'
                            orientation='right'
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                          />
                          <Tooltip
                            formatter={(value: number, name: string) => {
                              if (name === 'revenue') {
                                return [formatCurrency(value), dashboardContent.charts.revenueTrend.revenueLegend];
                              }

                              return [value, dashboardContent.charts.revenueTrend.bookingsLegend];
                            }}
                            labelFormatter={(label) => String(label)}
                          />
                          <Legend
                            formatter={(value) =>
                              value === 'revenue'
                                ? dashboardContent.charts.revenueTrend.revenueLegend
                                : dashboardContent.charts.revenueTrend.bookingsLegend
                            }
                          />
                          <Area
                            yAxisId='left'
                            type='monotone'
                            dataKey='revenue'
                            stroke='#eb662b'
                            fill='url(#adminRevenueGradient)'
                            strokeWidth={2}
                            isAnimationActive
                            animationDuration={700}
                          />
                          <Line
                            yAxisId='right'
                            type='monotone'
                            dataKey='bookings'
                            stroke='#05073c'
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                            isAnimationActive
                            animationDuration={850}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className='text-14 text-dark-1' style={{ opacity: 0.68 }}>
                      {dashboardContent.messages.emptyChart}
                    </div>
                  )}
                </AdminDashboardPanel>
              </FadeIn>
            </div>

            <div className='col-xl-4 col-lg-12'>
              <FadeIn delay={0.08}>
                <AdminDashboardPanel
                  title={dashboardContent.charts.bookingStatus.title}
                  subtitle={dashboardContent.charts.bookingStatus.subtitle}
                >
                  {dashboardView.statusBreakdown.some((item) => item.count > 0) ? (
                    <>
                      <div style={{ height: 240 }}>
                        <ResponsiveContainer width='100%' height='100%'>
                          <PieChart>
                            <Pie
                              data={dashboardView.statusBreakdown}
                              dataKey='count'
                              nameKey='label'
                              innerRadius={55}
                              outerRadius={85}
                              paddingAngle={2}
                              isAnimationActive
                              animationDuration={700}
                            >
                              {dashboardView.statusBreakdown.map((entry) => (
                                <Cell key={entry.key} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [value, dashboardContent.charts.bookingStatus.totalLabel]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className='row y-gap-10'>
                        {dashboardView.statusBreakdown.map((item) => (
                          <div key={item.key} className='col-12'>
                            <div className='d-flex items-center justify-between'>
                              <div className='d-flex items-center x-gap-10'>
                                <span
                                  className='rounded-full d-block'
                                  style={{
                                    width: 10,
                                    height: 10,
                                    backgroundColor: item.color,
                                  }}
                                />
                                <span className='text-14'>{item.label}</span>
                              </div>
                              <span className='text-14 fw-500'>{item.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className='text-14 text-dark-1' style={{ opacity: 0.68 }}>
                      {dashboardContent.messages.emptyChart}
                    </div>
                  )}
                </AdminDashboardPanel>
              </FadeIn>
            </div>
          </div>

          <div className='row y-gap-20 pt-20'>
            <div className='col-xl-7 col-lg-12'>
              <FadeIn delay={0.1}>
                <AdminDashboardPanel
                  title={dashboardContent.charts.topDestinations.title}
                  subtitle={dashboardContent.charts.topDestinations.subtitle}
                >
                  {dashboardView.topDestinations.length > 0 ? (
                    <div style={{ height: 320 }}>
                      <ResponsiveContainer width='100%' height='100%'>
                        <BarChart
                          data={dashboardView.topDestinations}
                          layout='vertical'
                          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                        >
                          <CartesianGrid stroke='#F2F2F2' horizontal={true} vertical={false} />
                          <XAxis
                            type='number'
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            allowDecimals={false}
                          />
                          <YAxis
                            dataKey='name'
                            type='category'
                            width={110}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            formatter={(value: number, name: string) =>
                              name === 'revenue'
                                ? [formatCurrency(value), dashboardContent.charts.topTours.columns.revenue]
                                : [value, dashboardContent.charts.topTours.columns.bookings]
                            }
                          />
                          <Bar
                            dataKey='bookings'
                            radius={[0, 8, 8, 0]}
                            fill='#05073c'
                            isAnimationActive
                            animationDuration={700}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className='text-14 text-dark-1' style={{ opacity: 0.68 }}>
                      {dashboardContent.messages.emptyChart}
                    </div>
                  )}

                  <AdminTopDestinationsSummary
                    items={dashboardView.topDestinations}
                    bookingsSuffix={dashboardContent.charts.topDestinations.bookingsSuffix}
                    formatCurrency={formatCurrency}
                  />
                </AdminDashboardPanel>
              </FadeIn>
            </div>

            <div className='col-xl-5 col-lg-12'>
              <FadeIn delay={0.12}>
                <AdminDashboardPanel
                  title={dashboardContent.charts.ratings.title}
                  subtitle={dashboardContent.charts.ratings.subtitle}
                  rightSlot={
                    <div className='text-right'>
                      <div className='text-12 text-dark-1' style={{ opacity: 0.68 }}>
                        {dashboardContent.charts.ratings.averageLabel}
                      </div>
                      <div className='text-18 fw-600'>
                        {dashboardView.averageRating > 0 ? dashboardView.averageRating.toFixed(1) : '0.0'}
                      </div>
                    </div>
                  }
                >
                  {dashboardView.ratingDistribution.some((item) => item.count > 0) ? (
                    <div style={{ height: 320 }}>
                      <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={dashboardView.ratingDistribution}>
                          <CartesianGrid stroke='#F2F2F2' vertical={false} />
                          <XAxis dataKey='label' tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(value: number) => [value, 'Reviews']} />
                          <Bar
                            dataKey='count'
                            radius={[8, 8, 0, 0]}
                            isAnimationActive
                            animationDuration={800}
                          >
                            {dashboardView.ratingDistribution.map((item) => (
                              <Cell key={item.label} fill={item.rating >= 4 ? '#27AE60' : item.rating === 3 ? '#F2994A' : '#EB5757'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className='text-14 text-dark-1' style={{ opacity: 0.68 }}>
                      {dashboardContent.messages.emptyChart}
                    </div>
                  )}
                </AdminDashboardPanel>
              </FadeIn>
            </div>
          </div>

          <div className='row y-gap-20 pt-20'>
            <div className='col-12'>
              <FadeIn delay={0.14}>
                <AdminDashboardPanel
                  title={dashboardContent.charts.topTours.title}
                  subtitle={dashboardContent.charts.topTours.subtitle}
                  rightSlot={
                    <div
                      className='d-flex items-center'
                      style={{ columnGap: 8 }}
                    >
                      {(['bookings', 'revenue'] as const).map((metric) => {
                        const active = topToursMetric === metric;
                        const label = dashboardContent.charts.topTours.columns[metric];

                        return (
                          <button
                            key={metric}
                            type='button'
                            onClick={() => setTopToursMetric(metric)}
                            className='button -sm rounded-200'
                            style={{
                              border: `1px solid ${active ? '#eb662b' : '#E7E6E6'}`,
                              backgroundColor: active ? 'rgba(235, 102, 43, 0.08)' : '#fff',
                              color: active ? '#eb662b' : '#05073c',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontWeight: 500,
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  }
                >
                  {dashboardView.topTours.length > 0 ? (
                    <div style={{ height: 300 }}>
                      <ResponsiveContainer width='100%' height='100%'>
                        <BarChart
                          data={dashboardView.topTours}
                          layout='vertical'
                          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid stroke='#F2F2F2' horizontal={true} vertical={false} />
                          <XAxis
                            type='number'
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            allowDecimals={false}
                            tickFormatter={(value) =>
                              topToursMetric === 'revenue'
                                ? formatCompactNumber(Number(value))
                                : String(value)
                            }
                          />
                          <YAxis
                            type='category'
                            dataKey='title'
                            width={180}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => truncateChartLabel(String(value))}
                          />
                          <Tooltip
                            formatter={(value: number) => [
                              topToursMetric === 'revenue' ? formatCurrency(value) : value,
                              dashboardContent.charts.topTours.columns[topToursMetric],
                            ]}
                            labelFormatter={(label) => String(label)}
                          />
                          <Bar
                            dataKey={topToursMetric}
                            fill={topToursMetric === 'revenue' ? '#eb662b' : '#05073c'}
                            radius={[0, 8, 8, 0]}
                            isAnimationActive
                            animationDuration={700}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className='text-14 text-dark-1' style={{ opacity: 0.68 }}>
                      {dashboardContent.messages.emptyChart}
                    </div>
                  )}

                  {dashboardView.topTours.length > 0 ? <div className='mt-20 mb-5 line'></div> : null}

                  <AdminTopToursTable
                    rows={dashboardView.topTours}
                    labels={{
                      ...dashboardContent.charts.topTours.columns,
                      empty: dashboardContent.messages.emptyTopTours,
                    }}
                    formatCurrency={formatCurrency}
                  />
                </AdminDashboardPanel>
              </FadeIn>
            </div>
          </div>
        </>
      ) : null}
    </AdminShell>
  );
}
