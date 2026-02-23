require "optparse"
require "date"

def slugify(text)
  text.to_s
      .downcase
      .strip
      .gsub(/[\s_]+/, "-")
      .gsub(/[^a-z0-9\-]/, "")
      .gsub(/-+/, "-")
      .gsub(/^-|-$/, "")
end

options = {
  lang: nil,
  title: nil,
  slug: nil,
  time: Time.now
}

parser = OptionParser.new do |opts|
  opts.banner = "Usage: ruby scripts/new_post.rb --lang <ja|en> --title \"Your title\" [--slug your-slug]"

  opts.on("--lang LANG", "Language: ja or en") do |value|
    options[:lang] = value
  end

  opts.on("--title TITLE", "Post title") do |value|
    options[:title] = value
  end

  opts.on("--slug SLUG", "URL slug (optional)") do |value|
    options[:slug] = value
  end
end

parser.parse!

unless %w[ja en].include?(options[:lang])
  abort("Error: --lang must be 'ja' or 'en'")
end

if options[:title].nil? || options[:title].strip.empty?
  abort("Error: --title is required")
end

slug = options[:slug].to_s.strip
slug = slugify(options[:title]) if slug.empty?

if slug.empty?
  abort("Error: Could not generate slug. Please provide --slug")
end

date = options[:time].strftime("%Y-%m-%d")
timestamp = options[:time].strftime("%Y-%m-%d %H:%M:%S %z")
filename = "#{date}-#{slug}-#{options[:lang]}.md"
path = File.join("_posts", filename)
permalink = "/#{options[:lang]}/blog/#{slug}/"
category = options[:lang]
body = options[:lang] == "ja" ? "ここに本文を記載します。" : "Write your content here."
default_tags = options[:lang] == "ja" ? "[お知らせ]" : "[announcement]"
sidebar_nav = options[:lang] == "ja" ? "nav_ja" : "nav_en"
safe_title = options[:title].gsub('"', '\\"')

if File.exist?(path)
  abort("Error: File already exists: #{path}")
end

content = <<~MARKDOWN
  ---
  layout: single
  title: "#{safe_title}"
  date: #{timestamp}
  lang: #{options[:lang]}
  categories: [blog, #{category}]
  tags: #{default_tags}
  sidebar:
    nav: "#{sidebar_nav}"
  permalink: #{permalink}
  ---

  #{body}
MARKDOWN

File.write(path, content)
puts "Created: #{path}"