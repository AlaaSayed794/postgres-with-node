import e from 'express';
import Client from '../database';

export type Todo = {
  id?: number;
  title: string;
  completed: boolean;
};

export class TodoStore {

  async index(): Promise<Todo[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM todos';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not get todos. Error: ${(err as Error).message}`
      );
    }
  }

  async show(id: number): Promise<Todo> {
    try {
      const sql = 'SELECT * FROM todos WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not find todo ${id}. Error: ${(err as Error).message}`
      );
    }
  }

  async create(title: string): Promise<Todo> {
    try {
      const sql =
        'INSERT INTO todos (title,completed) VALUES($1, false) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [title]);

      const todo = result.rows[0];

      conn.release();

      return todo;
    } catch (err) {
      throw new Error(
        `Could not create new todo with title : ${title} . Error: ${(err as Error).message
        }`
      );
    }
  }

  async delete(id: number): Promise<number> {
    try {
      const sql = 'DELETE FROM todos WHERE id=($1)'

      const conn = await Client.connect()

      const result = await conn.query(sql, [id])
      console.log(result)
      const numberOfDeletedRows = result.rowCount

      conn.release()

      return numberOfDeletedRows
    } catch (err) {
      throw new Error(`Could not delete todo ${id}. Error: ${err}`)
    }
  }

  async update(id: number, title: string | undefined, completed: boolean | undefined): Promise<Todo> {
    try {
      const titleType: boolean = typeof title !== "undefined"
      const completedType: boolean = typeof completed !== "undefined"
      const conn = await Client.connect()
      let sql, result, todo
      if (titleType && completedType) {
        sql = 'Update todos SET title=($2),completed=($3) WHERE id=($1) RETURNING *'
        result = await conn.query(sql, [id, title, completed])
        todo = result.rows[0]
      }
      else if (titleType) {
        sql = 'Update todos SET title=($2) WHERE id=($1) RETURNING *'
        result = await conn.query(sql, [id, title])
        todo = result.rows[0]
      }
      else {
        sql = 'Update todos SET completed=($2) WHERE id=($1) RETURNING *'
        result = await conn.query(sql, [id, completed])
        todo = result.rows[0]
      }
      conn.release()

      return todo
    } catch (err) {
      throw new Error(`Could not update todo ${id}. Error: ${err}`)
    }
  }

}
