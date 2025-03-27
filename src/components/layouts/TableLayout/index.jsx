import { v4 as uuidv4 } from 'uuid'
import React from 'react'
import { useTable } from 'react-table'

import { Paginate } from './Paginate'
import { RootDesc } from '@/components/ui/descriptions/RootDesc'
import { OuterBlock } from '@/components/ui/general/OuterBlock'
import { ErrorTable } from '@/components/ui/general/ErrorTable'

import styles from './styles.module.scss'

export const TableLayout = props => {
	const {
		columns,
		fakeData,
		data,
		serverStatus,
		error,
		toPage,
		page,
		sortBy,
		totalPages,
		emptyWarn,
	} = props

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable({
			columns,
			data: fakeData || data,
		})

	return (
		<OuterBlock>
			<div className={styles.table_wrapper}>
				{serverStatus === 'error' || error ? (
					<ErrorTable error={error} />
				) : (
					data.length === 0 && <ErrorTable error={emptyWarn} />
				)}

				<table
					style={
						fakeData
							? { opacity: '0.2', pointerEvents: 'none' }
							: { opacity: '1', pointerEvents: 'all' }
					}
					className={styles.table}
					{...getTableProps()}
				>
					<thead>
						{headerGroups.map(headerGroup => (
							<tr {...headerGroup.getHeaderGroupProps()} key={uuidv4()}>
								{headerGroup.headers.map(column => (
									<th
										{...column.getHeaderProps()}
										key={column.id}
										title={`Sort by ${column.render('Header').toLowerCase()}`}
										onClick={() => (fakeData ? undefined : sortBy(column))}
										style={
											column.id === 'cover' || column.id === 'actions'
												? { pointerEvents: 'none' }
												: {}
										}
									>
										<RootDesc>
											<b>{column.render('Header')}</b>
										</RootDesc>

										{column.id !== 'cover' && column.id !== 'actions' && (
											<i></i>
										)}
									</th>
								))}
							</tr>
						))}
					</thead>

					<tbody {...getTableBodyProps()}>
						{rows.map(row => {
							prepareRow(row)

							return (
								<tr {...row.getRowProps()} key={row.id}>
									{row.cells.map(cell => (
										<td {...cell.getCellProps()} key={cell.column.id}>
											<RootDesc>
												<span>{cell.render('Cell')}</span>
											</RootDesc>
										</td>
									))}
								</tr>
							)
						})}
					</tbody>
				</table>

				{serverStatus !== 'error' && totalPages > 1 && (
					<Paginate page={page} totalPages={totalPages} toPage={toPage} />
				)}
			</div>
		</OuterBlock>
	)
}
