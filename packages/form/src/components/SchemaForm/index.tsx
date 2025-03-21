﻿import { LabelIconTip, omitUndefined, runFunction, useLatest } from '@ant-design/pro-utils';
import type { FormProps } from 'antd';
import { Form } from 'antd';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { ProFormInstance } from '../../BaseForm';
import type { ProFormProps } from '../../layouts';
import { DrawerForm } from '../../layouts/DrawerForm';
import { LightFilter } from '../../layouts/LightFilter';
import { ModalForm } from '../../layouts/ModalForm';
import { ProForm } from '../../layouts/ProForm';
import { QueryFilter } from '../../layouts/QueryFilter';
import { StepsForm as ProStepsForm } from '../../layouts/StepsForm';
import { Embed, StepsForm } from './layoutType';
import type {
  FormSchema,
  ItemType,
  ProFormColumnsType,
  ProFormRenderValueTypeHelpers,
  ProFormRenderValueTypeItem,
} from './typing';
import { renderValueType } from './valueType';

export * from './typing';

const FormLayoutType = {
  DrawerForm,
  QueryFilter,
  LightFilter,
  StepForm: ProStepsForm.StepForm,
  StepsForm: StepsForm,
  ModalForm,
  Embed,
};

/**
 * 此组件可以根据 Json Schema 来生成相应的表单,大部分配置与 antd 的 table 列配置相同
 *
 * @see 此组件仍为 beta 版本，api 可能发生变化
 */

function BetaSchemaForm<T, ValueType = 'text'>(props: FormSchema<T, ValueType>) {
  const {
    columns,
    layoutType = 'Form',
    type = 'form',
    action,
    shouldUpdate = true,
    formRef: propsFormRef,
    ...restProps
  } = props;

  const FormRenderComponents = (FormLayoutType[layoutType] || ProForm) as React.FC<ProFormProps<T>>;
  const [form] = Form.useForm();
  const formInstance = Form.useFormInstance();

  const [, forceUpdate] = useState<[]>([]);
  const [formDomsDeps, updatedFormDoms] = useState<[]>([]);

  const formRef = useRef<ProFormInstance | undefined>(props.form || formInstance || form);
  const oldValuesRef = useRef<T>();
  const propsRef = useLatest(props);

  if (propsFormRef) {
    (propsFormRef as React.MutableRefObject<ProFormInstance<any> | undefined | null>).current =
      formRef.current;
  }

  /**
   * 生成子项，方便被 table 接入
   *
   * @param items
   */
  const genItems: ProFormRenderValueTypeHelpers<T, ValueType>['genItems'] = useCallback(
    (items: ProFormColumnsType<T, ValueType>[]) => {
      return items
        .filter((originItem) => {
          return !(originItem.hideInForm && type === 'form');
        })
        .sort((a, b) => {
          if (b.order || a.order) {
            return (b.order || 0) - (a.order || 0);
          }
          return (b.index || 0) - (a.index || 0);
        })
        .map((originItem, index) => {
          const title = runFunction(
            originItem.title,
            originItem,
            'form',
            <LabelIconTip
              label={originItem.title as string}
              tooltip={originItem.tooltip || originItem.tip}
            />,
          );

          const item = omitUndefined({
            title,
            label: title,
            name: originItem.name,
            valueType: runFunction(originItem.valueType, {}),
            key: originItem.key || originItem.dataIndex || index,
            columns: originItem.columns,
            valueEnum: originItem.valueEnum,
            dataIndex: originItem.dataIndex || originItem.key,
            initialValue: originItem.initialValue,
            width: originItem.width,
            index: originItem.index,
            readonly: originItem.readonly,
            colSize: originItem.colSize,
            colProps: originItem.colProps,
            rowProps: originItem.rowProps,
            className: originItem.className,
            tooltip: originItem.tooltip || originItem.tip,
            dependencies: originItem.dependencies,
            proFieldProps: originItem.proFieldProps,
            ignoreFormItem: originItem.ignoreFormItem,
            getFieldProps: originItem.fieldProps
              ? () => runFunction(originItem.fieldProps, formRef.current, originItem)
              : undefined,
            getFormItemProps: originItem.formItemProps
              ? () => runFunction(originItem.formItemProps, formRef.current, originItem)
              : undefined,
            render: originItem.render,
            renderFormItem: originItem.renderFormItem,
            renderText: originItem.renderText,
            request: originItem.request,
            params: originItem.params,
            transform: originItem.transform,
            convertValue: originItem.convertValue,
            debounceTime: originItem.debounceTime,
          }) as ItemType<any, any>;

          return renderValueType(item, {
            action,
            type,
            originItem,
            formRef,
            genItems,
          });
        })
        .filter((field) => {
          return Boolean(field);
        });
    },
    [action, formRef, type],
  );

  const onValuesChange: FormProps<T>['onValuesChange'] = useCallback(
    (changedValues: any, values: T) => {
      const { onValuesChange: propsOnValuesChange } = propsRef.current;
      if (
        shouldUpdate === true ||
        (typeof shouldUpdate === 'function' && shouldUpdate(values, oldValuesRef.current))
      ) {
        updatedFormDoms([]);
      }
      oldValuesRef.current = values;
      propsOnValuesChange?.(changedValues, values);
    },
    [propsRef, shouldUpdate],
  );

  const formChildrenDoms = useMemo(() => {
    if (!formRef.current) return;
    // like StepsForm's columns but not only for StepsForm
    if (columns.length && Array.isArray(columns[0])) return;

    return genItems(columns as ProFormColumnsType<T, ValueType>[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, genItems, formDomsDeps]);

  /**
   * Append layoutType component specific props
   */
  const specificProps = useMemo(() => {
    if (layoutType === 'StepsForm') {
      return {
        forceUpdate: forceUpdate,
        columns: columns as ProFormColumnsType<T, ValueType>[][],
      };
    }

    return {};
  }, [columns, layoutType]);

  return (
    <FormRenderComponents
      {...specificProps}
      {...restProps}
      form={props.form || form}
      formRef={formRef}
      onValuesChange={onValuesChange}
    >
      {formChildrenDoms}
    </FormRenderComponents>
  );
}

export default BetaSchemaForm;
