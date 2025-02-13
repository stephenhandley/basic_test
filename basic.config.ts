export const schema = {
    // "project_id": "26b198d8-a464-486d-bcae-63455f001763",
    "tables": {
      "post": {
        "type": "collection",
        "fields": {
          "title": {
            "type": "string",
            "indexed": true
          },
          "body": {
            "type": "string",
            "indexed": true
          }
        }
      },
      "comment": {
        "type": "collection",
        "fields": {
          "post_id": {
            "type": "string",
            "indexed": true
          },
          "body": {
            "type": "string",
            "indexed": true
          }
        }
      }
    },
    "version": 1
  }