import React from 'react';
import classNames from "classnames";
import Option from './bootstrap/Option';
import IntlMessages from "./IntlMessages";
import Select from './bootstrap/forms/Select';
import Pagination, { PaginationItem } from './bootstrap/Pagination';
import { CardFooter, CardFooterLeft, CardFooterRight } from './bootstrap/Card';

export const PER_COUNT = {
	10: 10,
	25: 20,
	50: 50,
	100: 100,
};

export type PaginationButtonsProps = {
	wrapperClassName?: string,
	label: string;
	totalItems: number;
	currentPage: number;
	perPage: number;
	setCurrentPage: (page: number) => void;
	setPerPage: (perPage: number) => void;
}

const PaginationButtons = ({ wrapperClassName, setCurrentPage, currentPage, perPage, setPerPage, totalItems, label }: PaginationButtonsProps) => {
	const totalPage = Math.ceil(totalItems / perPage);

	const pagination = () => {
		let items = [];

		let i = currentPage - 1;
		while (i >= currentPage - 1 && i > 0) {
			items.push(
				<PaginationItem key={i} onClick={() => setCurrentPage(currentPage - 1)}>
					{i}
				</PaginationItem>,
			);

			i -= 1;
		}

		items = items.reverse();

		items.push(
			<PaginationItem key={currentPage} isActive onClick={() => setCurrentPage(currentPage)}>
				{currentPage}
			</PaginationItem>,
		);

		i = currentPage + 1;
		while (i <= currentPage + 1 && i <= totalPage) {
			items.push(
				<PaginationItem key={i} onClick={() => setCurrentPage(currentPage + 1)}>
					{i}
				</PaginationItem>,
			);

			i += 1;
		}

		return items;
	};

	const getInfo = () => {
		const start = perPage * (currentPage - 1) + 1;

		const end = perPage * currentPage;

		return (
			<span className='pagination__desc'>
				<IntlMessages
					id='pagination.desc'
					values={{
						start,
						end: end > totalItems ? totalItems : end,
						total: totalItems,
						label
					}}
				/>
			</span>
		);
	};

	return (
		<CardFooter className={classNames(wrapperClassName, 'flex-row')}>
			<CardFooterLeft>
				<span className='text-muted'>{getInfo()}</span>
			</CardFooterLeft>

			<CardFooterRight className='d-flex'>
				{totalPage > 1 && (
					<Pagination ariaLabel={label}>
						<PaginationItem
							isFirst
							isDisabled={!(currentPage - 1 > 0)}
							onClick={() => setCurrentPage(1)}
						/>
						<PaginationItem
							isPrev
							isDisabled={!(currentPage - 1 > 0)}
							onClick={() => setCurrentPage(currentPage - 1)}
						/>
						{currentPage - 1 > 1 && (
							<PaginationItem onClick={() => setCurrentPage(currentPage - 2)}>
								...
							</PaginationItem>
						)}
						{pagination()}
						{currentPage + 1 < totalPage && (
							<PaginationItem onClick={() => setCurrentPage(currentPage + 2)}>
								...
							</PaginationItem>
						)}
						<PaginationItem
							isNext
							isDisabled={!(currentPage + 1 <= totalPage)}
							onClick={() => setCurrentPage(currentPage + 1)}
						/>
						<PaginationItem
							isLast
							isDisabled={!(currentPage + 1 <= totalPage)}
							onClick={() => setCurrentPage(totalPage)}
						/>
					</Pagination>
				)}

				{/* @ts-ignore */}
				<Select
					size='sm'
					ariaLabel='Per'
					onChange={(e: { target: { value: string; }; }) => {
						setPerPage(parseInt(e.target.value, 10));
						setCurrentPage(1);
					}}
					value={perPage.toString()}>
					{Object.keys(PER_COUNT).map((i) => (
						<Option key={i} value={i}>
							{i}
						</Option>
					))}
				</Select>
			</CardFooterRight>
		</CardFooter>
	);
};

PaginationButtons.defaultProps = {
	label: 'items',
};

export default PaginationButtons;
