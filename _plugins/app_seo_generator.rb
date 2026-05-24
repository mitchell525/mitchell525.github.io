# frozen_string_literal: true

Jekyll::Hooks.register :site, :post_read do |site|
  apps_by_slug = (site.data["apps"] || []).each_with_object({}) do |app, hash|
    hash[app["slug"]] = app if app["slug"]
  end

  site.collections["apps"]&.docs&.each do |doc|
    app = apps_by_slug[doc.data["slug"]]
    next unless app

    doc.data["title"] = "#{app['name']} — #{app['tagline']}" unless doc.data.key?("title")
    doc.data["description"] = app["description"] unless doc.data.key?("description")
    doc.data["image"] = app["screenshots"]&.first || app["icon"] unless doc.data.key?("image")
    doc.data.delete("date")
    doc.data["seo"] = (doc.data["seo"] || {}).merge("type" => "WebPage")
  end

  site.posts.docs.each do |doc|
    next unless doc.data["app_slug"] && !doc.data.key?("image")

    app = apps_by_slug[doc.data["app_slug"]]
    doc.data["image"] = app["icon"] if app
  end
end

Jekyll::Hooks.register :documents, :pre_render do |doc, _payload|
  next unless doc.is_a?(Jekyll::Document)
  next unless doc.collection&.label == "apps"

  doc.data.delete("date")
end
