import { ReactNode } from 'react';
import styles from './styles.module.sass';

export type TableColumn = {
  label: string;
};

type TableBody = ReactNode;

export type TableRow = TableBody[];

type TableProps = { columns: TableColumn[]; body: TableRow[] };

export function Table(props: TableProps) {
  const { columns, body } = props;

  return (
    <table className={styles.base}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th className={styles.head} key={column.label}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td className={styles.body} key={cellIndex}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
