import { MessageDescriptor, useIntl, createIntl } from 'react-intl';
import localeObj from '../locale/en-US';

const intl = createIntl(localeObj);

interface Args<T extends string> extends MessageDescriptor {
  id: T;
}

export const formatMessage = (props: Args<keyof typeof localeObj.messages>) => {
  return intl.formatMessage(props);
};
