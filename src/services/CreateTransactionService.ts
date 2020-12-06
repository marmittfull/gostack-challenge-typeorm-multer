import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

export default class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    if (!['income', 'outcome'].includes(type))
      throw new AppError('Invalid transaction type.');

    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && total < value)
      throw new AppError('You do not have enough money!');

    // verificar se a categoria existe já ou não.

    let categorydb = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categorydb) {
      categorydb = categoriesRepository.create({ title: category });
      await categoriesRepository.save(categorydb);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categorydb,
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }
}
