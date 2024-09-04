import random
import os
from datetime import datetime
import re
from openai import OpenAI

def slugify(text):
    text = text.lower()
    return re.sub(r'[^\w\s-]', '', text).strip().replace(' ', '-')

def read_keywords(file_path):
    with open(file_path, 'r') as file:
        return [line.strip() for line in file if line.strip()]

def generate_blog_post(keyword):
    prompt = f"""Generate a compelling blog post title and content about '{keyword}'. 
    The content should be in HTML format, excluding the outer <html>, <head>, and <body> tags.
    Make sure to add a title within <h1> tags."""
    client = OpenAI(api_key="sk-proj-ZWZVp9jM0e3SqUQQELX8T3BlbkFJ8fDmikeoI9FKtTqsM36B")
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates blog posts."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

def create_blog_post_file(title, content):
    slug = slugify(title)
    directory = f"app/blog/{slug}"
    os.makedirs(directory, exist_ok=True)
    
    file_path = f"{directory}/page.js"
    with open(file_path, 'w') as file:
        file.write(f"""
import React from 'react';

export const metadata = {{
    title: "{title}",
    description: "Blog post about {title}",
}};

export default function BlogPost() {{
    return (
        <article className="blog-post">
            {content}
        </article>
    );
}}
""")
    print(f"Blog post created: {file_path}")

def main():

    keywords_file = "utils/SEOKeywords.txt"
    keywords = read_keywords(keywords_file)
    
    if not keywords:
        print("No keywords found in the file.")
        return
    
    keyword = random.choice(keywords)
    print(f"Selected keyword: {keyword}")
    
    blog_post = generate_blog_post(keyword)
    
    # Extract title from the generated content (assuming it's an <h1> tag)
    title_start = blog_post.find("<h1>") + 4
    title_end = blog_post.find("</h1>")
    title = blog_post[title_start:title_end].strip()
    
    create_blog_post_file(title, blog_post)

if __name__ == "__main__":
    main()