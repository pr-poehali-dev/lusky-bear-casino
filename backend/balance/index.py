"""
API для управления балансом пользователя казино Lucky Bear.
Позволяет получать баланс, обновлять его и просматривать транзакции.
"""

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('x-user-id', headers.get('X-User-Id', 'demo_user'))
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute(
                "SELECT * FROM users WHERE user_id = %s",
                (user_id,)
            )
            user = cur.fetchone()
            
            if not user:
                cur.execute(
                    "INSERT INTO users (user_id, balance, level, nickname) VALUES (%s, 4000, 3, 'Серия-dy') RETURNING *",
                    (user_id,)
                )
                conn.commit()
                user = cur.fetchone()
            
            cur.execute(
                "SELECT * FROM transactions WHERE user_id = %s ORDER BY created_at DESC LIMIT 10",
                (user_id,)
            )
            transactions = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'user': dict(user),
                    'transactions': [dict(t) for t in transactions]
                }, default=str),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            amount = body_data.get('amount', 0)
            transaction_type = body_data.get('type', 'bet')
            game_type = body_data.get('game_type', 'slot')
            description = body_data.get('description', '')
            
            cur.execute(
                "SELECT balance FROM users WHERE user_id = %s",
                (user_id,)
            )
            user = cur.fetchone()
            
            if not user:
                cur.execute(
                    "INSERT INTO users (user_id, balance) VALUES (%s, 4000) RETURNING balance",
                    (user_id,)
                )
                conn.commit()
                user = cur.fetchone()
            
            new_balance = user['balance'] + amount
            
            if new_balance < 0:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Insufficient balance'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "UPDATE users SET balance = %s, updated_at = CURRENT_TIMESTAMP WHERE user_id = %s",
                (new_balance, user_id)
            )
            
            if transaction_type == 'win':
                cur.execute(
                    "UPDATE users SET total_wins = total_wins + 1 WHERE user_id = %s",
                    (user_id,)
                )
            elif transaction_type == 'bet':
                cur.execute(
                    "UPDATE users SET total_bets = total_bets + 1 WHERE user_id = %s",
                    (user_id,)
                )
            
            cur.execute(
                "INSERT INTO transactions (user_id, amount, transaction_type, game_type, description) VALUES (%s, %s, %s, %s, %s)",
                (user_id, amount, transaction_type, game_type, description)
            )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'balance': new_balance,
                    'amount': amount,
                    'type': transaction_type
                }),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
