# ブログ
{% for post in site.categories["Blog"] %}
* [{{ post.date | date: "%Y/%m/%d" }}「{{ post.slug }}」]({{ post.url }})
{% endfor %}
