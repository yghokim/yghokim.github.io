'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { mainFont } from '../_lib/fonts';

interface AntdProviderProps {
  children: React.ReactNode;
}

export function AntdProvider({ children }: AntdProviderProps) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: mainFont.style.fontFamily,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}