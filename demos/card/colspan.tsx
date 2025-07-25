import { ProCard } from '@ant-design/pro-components';

export default () => {
  return (
    <>
      <ProCard
        direction="column"
        ghost
        gutter={{
          xs: 8,
          sm: 8,
          md: 8,
          lg: 8,
          xl: 8,
          xxl: 8,
        }}
      >
        <ProCard layout="center" variant="outlined">
          colSpan - 24
        </ProCard>
        <ProCard
          colSpan={{
            xs: 24,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12,
            xxl: 24,
          }}
          layout="center"
          variant="outlined"
        >
          colSpan - 12
        </ProCard>
        <ProCard
          colSpan={{
            xs: 24,
            sm: 12,
            md: 8,
            lg: 6,
          }}
          layout="center"
          variant="outlined"
        >
          colSpan - 8
        </ProCard>
        <ProCard colSpan={0} layout="center" variant="outlined">
          colSpan - 0
        </ProCard>
      </ProCard>
      <ProCard gutter={8} title="24 grids" style={{ marginBlockStart: 8 }}>
        <ProCard colSpan={12} layout="center" variant="outlined">
          colSpan-12
        </ProCard>
        <ProCard colSpan={6} layout="center" variant="outlined">
          colSpan-6
        </ProCard>
        <ProCard colSpan={6} layout="center" variant="outlined">
          colSpan-6
        </ProCard>
      </ProCard>
      <ProCard style={{ marginBlockStart: 8 }} gutter={8} ghost>
        <ProCard colSpan="200px" layout="center" variant="outlined">
          colSpan - 200px
        </ProCard>
        <ProCard layout="center" variant="outlined">
          Auto
        </ProCard>
      </ProCard>
      <ProCard style={{ marginBlockStart: 8 }} gutter={8} ghost>
        <ProCard variant="outlined" layout="center">
          Auto
        </ProCard>
        <ProCard colSpan="30%" variant="outlined">
          colSpan - 30%
        </ProCard>
      </ProCard>
    </>
  );
};
