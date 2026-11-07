# お知らせ
{% for post in site.categories["Notice"] %}
* [{{ post.date | date: "%Y/%m/%d" }}「{{ post.slug }}」]({{ post.url }})
{% endfor %}
