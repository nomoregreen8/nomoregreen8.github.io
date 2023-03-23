from flask import Flask, render_template, request, redirect, url_for
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_story():
    title = request.form['title']
    author = request.form['author']
    content = request.form['content']

    with open(os.path.join('stories', f'{title}.txt'), 'w') as story_file:
        story_file.write(f'Title: {title}\n')
        story_file.write(f'Author: {author}\n\n')
        story_file.write(content)

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
