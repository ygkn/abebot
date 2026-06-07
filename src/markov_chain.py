import re
import random
from collections import deque

from janome.tokenizer import Tokenizer

t = Tokenizer(wakati=True)
BOS = "[BOS]" # Begining of sentence
EOS = "。" # ending of sentence

def read_textfile(textfile_path):
    '''.txtから文字列を取得する

    Args:
        textfile_path(str): テキストファイルが格納されているパス
    
    Returns:
        str : ファイル内の文字列
    '''
    f = open(textfile_path, 'r', encoding='UTF-8')
    text = f.read()
    unnecessary_letters = [" ", "\n", "「", "」", "『", "』"]
    pattern = '|'.join(unnecessary_letters)
    text = re.sub(pattern, "", text)
    f.close()
    return text

def _wakati(text):
    '''分かち書きを行う

    Args:
        text(str): 分かち書きしたい文章
    
    Returns:
        list(str) : 分かち書きされた文章
    '''
    wordlist = []
    for one_line_text in _one_sentence_generator(text):
        wordlist += list( t.tokenize(one_line_text) ) # janomeはitrを返すのでlistに変換
    return wordlist

def _one_sentence_generator(long_text):
  '''長いテキストを分割して小分けに返す

  Args:
    long_text(str): 分かち書きしたい文章
  
  Returns:
    str : 1文に分割した文章
  '''
  sentences = re.findall(f".*?{EOS}", long_text)
  for sentence in sentences:
      yield sentence

def make_model(long_text, order=2):
    '''モデルを作成する

    Args:
        long_text(str): 文章生成のもととなる大量の文章
        order(int): N階マルコフのNを指定
    
    Returns:
        dict: { (過去の状態のタプル) : [次単語の候補リスト], ...}
    '''
    model = {}
    wordlist = _wakati(long_text)
    queue = deque([], order) # 最大長を超えると先頭から要素を削除
    queue.append(BOS)
    for markov_value in wordlist:
        if len(queue) < order:
            queue.append(markov_value)
            continue

        if queue[-1] == EOS:
            markov_key = tuple(queue) # keyをタプル型にしてハッシュ可能にする
            if markov_key not in model:
                model[markov_key] = []
            model.setdefault(markov_key, []).append(BOS)
            queue.append(BOS)
        markov_key = tuple(queue)
        model.setdefault(markov_key, []).append(markov_value)
        queue.append(markov_value)
    return model

def make_sentence(model, sentence_num=5, seed="[BOS]", max_words = 1000):
    '''モデルから文章を生成

    Args:
        model(dict): 元文章から生成したモデル
        sentence_num(int): 生成する文章数
        seed(str): 終了を示す単語
        max_words(int): seedが出ない場合に終了する語数

    Returns:
        str : 自動生成した文章
    '''
    sentence_count = 0
    key_candidates = [key for key in model if key[0] == seed]
    if not key_candidates:
        print("Not find Keyword")
        return
    markov_key = random.choice(key_candidates)
    queue = deque(list(markov_key), len(list(model.keys())[0]))

    sentence = "".join(markov_key)
    for _ in range(max_words):
        markov_key = tuple(queue)
        next_word = random.choice(model[markov_key])
        sentence += next_word
        queue.append(next_word)

        if next_word == EOS:
            sentence_count += 1
            if sentence_count == sentence_num:
                break
    return sentence

if __name__ == '__main__':
    file_path = "./input.txt"
    order = 3
    # 元文章の取得
    long_text = read_textfile(file_path)
    # モデルの作成
    model = make_model(long_text, order)
    # モデルから文章を生成
    sentence = make_sentence(model)
    # リストに分割
    sentence = sentence.lstrip(BOS) # 先頭を取り除いた上で
    sentence_list = [s.strip() for s in sentence.split(BOS)] # リストに分割
    print(sentence_list)

