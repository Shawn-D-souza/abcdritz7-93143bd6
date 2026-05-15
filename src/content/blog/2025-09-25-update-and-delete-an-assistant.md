---
summary: "Manage your AI bot in n8n AI agent workflows. Update names, edit instructions, or delete setups with instant sync on platform.openai.com."
title: "How to Update or Delete an Assistant (AI bot) in n8n"
slug: update-and-delete-an-assistant
category: Technology
author: Sangya Keswani
date: 2025-09-25T00:00:00.000Z
updated_date: 2025-09-25T00:00:00.000Z
thumbnail: /assets/uploads/sd1sSON2zQ6IdeyvqWz9c11nfo.jpeg
thumbnail_alt: "description: \"Manage your AI bot in n8n AI agent workflows. Update names, edit instructions, or delete setups with instant sync on platform.openai.com.\""
---

  

  

## 1\. How to Update Name & Instructions in n8n

To update the bot in n8n workflow automation, use the **'Update an Assistant'** option in the OpenAI node. You can update the name or instructions. You can also delete a bot using the **'Delete an Assistant**' option by providing its ID. These updates or deletions are applied instantly and appear in both n8n and the **OpenAI dashboard** ([platform.openai.com](https://platform.openai.com/assistants)), giving you complete control over your n8n AI automation setup.

  

### Step 1: Get the ID

  

![](/assets/uploads/NpPThjzyA5EWyzEdA786Bx7X6o.png)

  

Every new entry in n8n automatically receives a unique ID. This ID is required whenever you want to run an update command or a delete command. If you forget to copy it at the time of creation, don't worry—you can always go back to **List assistants** in n8n or check the OpenAI dashboard to get it. Keeping the ID handy, however, makes your n8n AI automation workflow smoother and faster to manage.

**Steps:**

*   Open your **n8n workflow**.
    
*   Run **List assistants** or open the **OpenAI dashboard**.
    
*   Copy or note the **unique ID** shown in the output.
    

  

![](/assets/uploads/eTyE7Scge4LRroY6uciy5yVYc.png)

  

### Step 2: Open Update an Assistant

Once you have the ID, the next step is to open the **Assistant Node**. This node contains various tools, including Create, List, and Update. To update the bot, select the Update option and paste the ID. You also need to choose the same account you used earlier to make sure the change is applied correctly.

*   Search for **Update** under the **OpenAI node**.
    
*   Select your account and paste the ID.
    

  

![](/assets/uploads/LUbSbI5hJBvzWpyevlHpB3YhQ.png)

  

### Step 3: Rename an existing bot

  

![](/assets/uploads/xVMrnsjAmQpDvtDYVWLL8JIlyWQ.png)

  

To rename an existing bot, go to the "**Update an Assistant"** option in the **OpenAI node**. Choose the bot from the dropdown list or paste its ID. In the options panel, you will see fields such as **Code Interpreter, Description, Files, Instructions, and Name**. Select **Name**, type the new name in the box, and then click **Execute Step**. For example, you can change _“mood-based movie recommender”_ to _“Mood Movie Bot.”_ Once saved, the new name will instantly show in both n8n and the [**OpenAI dashboard**](https://platform.openai.com/assistants?utm_source=chatgpt.com).

The following are the steps:

*   In **n8n**, go to **Update an Assistant**.
    
*   Select the bot from the list or paste its ID.
    
*   In the options, choose **Name**.
    
*   Enter the new name and click **Execute Step**.
    

  

![](/assets/uploads/AHqYSxxSAd9FpbH7sf1H2379XZY.png)

  

### Step 4: Update Instructions

  

![](/assets/uploads/SiMVmtgfSLvInEDD7x70PBQltM.png)

  

The instructions define how your entry behaves and what kind of output it gives. The clearer and more concise the instructions, the more reliable the answers will be.

You can transform a basic instruction, such as "recommend movies based on user mood," into a more specific one. For example, you can say "recommend Indian movies based on the mood of the user given via input." This makes the responses more relevant and personalized. Updating instructions is one of the best ways to improve the quality of your **n8n AI automation**.

*   Edit the **Instructions field**.
    
*   Example:
    
    *   Before: _"Recommend movies based on user mood."_
        
    *   After: _"Recommend Indian movies based on the mood of the user given via input."_
        
*   Save the Update by executing the step.
    

  

![](/assets/uploads/41W3ht4DRZX8oZJA1ddjPPrpWUs.png)

  

### Step 5: Verify Updates

  

![](/assets/uploads/VPpH5pGzwAD14ow7NP1wqXW65TA.png)

After you update a bot, it is important to check that the changes have been applied correctly. Verification helps you avoid errors and confusion later. This is especially true when you manage multiple bots at once. You can run the **List assistants** option inside n8n to see the updated details, or you can open the OpenAI dashboard and confirm them directly. Either way, checking your work ensures everything is in sync across systems.

*   Run **List assistants** inside n8n to confirm updated details.
    
*   Or check the **OpenAI dashboard** under the entries section.
    
*   There, we can see the updated name — Mood Movie Bot.
    

  

![](/assets/uploads/50l7SfFq8lvRx1aPIiyEM7a8zAg.png)

  

## 2\. How to Create & Delete an Assistant in n8n and the OpenAI Dashboard

Apart from updating, you may also need to create new entries or remove ones that you no longer need. Both creating and deleting can be done quickly, and the changes show right away in both n8n and the dashboard ([platform.openai.com/assistants](https://platform.openai.com/assistants)). Using the **n8n OpenAI integration**, you can start fresh with a new bot or delete an assistant that is no longer required. These actions help keep your environment clean and your workflows simple to manage.

###   

### Create a New Entry

To create a new bot, go to the **OpenAI dashboard**. On the top right, click the **Create** button. A new page will open where you can enter the **name** and **instructions**. Once you save, the system will automatically generate a unique **Assistant ID** for that setup.

![](/assets/uploads/jCmdEgSrNip4to8WUT4B770orQ.png)

  

Later, in the **n8n.io** platform, you can see this new entry appear inside the **Update an Assistant** option. For example, if you named it “test,” it will show up in the list with the same name. You can then select it directly or copy its ID to connect it to your workflow.

In the **OpenAI dashboard**:

*   Click **Create** (top right).
    
*   Enter **Name** and **Instructions**.
    
*   Save → a unique ID is auto-generated.
    

  

![](/assets/uploads/NJnCwIjLA7wGvFb6CaFXhrsHw.png)

  

In **n8n**, check **Update an Assistant** → the new entry (e.g., _test_) will appear in the list.

![](/assets/uploads/Tprjl8epFLSlBkicv674W2rdw.png)

  

### Delete an Assistant

![](/assets/uploads/HM0FvLDQ6zP7qG8XLmNtcXWThg.png)

To remove a bot, go to the **OpenAI node** inside your **n8n workflow automation**. Choose the **Delete an Assistant** option. From there, you can simply select the bot’s name from the dropdown list or paste its ID. Once you click **Execute Step**, the entry will be removed from both n8n and the [**OpenAI dashboard**](https://platform.openai.com/assistants?utm_source=chatgpt.com).

The following are the steps:

*   In **n8n**: open the **OpenAI node** → choose **Delete an Assistant**.
    
*   Select the name from the list (or paste the ID).
    
*   Click **Execute Step** → the bot is deleted from both n8n and the dashboard.
    

  

![](/assets/uploads/N8er8XEcAd4Zg6BryTCQSZ6maO4.png)

  

### How to Confirm Successful Deletion in n8n

It is always wise to confirm after running a delete command. This way, you can be sure that the entry has been completely removed. You can use the List option in n8n or simply refresh the dashboard. If it no longer appears in either place, the deletion was successful. Trying to use it again will give you an error, which confirms the removal.

*   Run **List assistants**
    
*   Refresh the **OpenAI dashboard** to confirm it is gone.
    

  

**Video:**

<youtube>https://www.youtube.com/watch?v=_qSwoYti8_8</youtube>

  

### Next Steps with Files in n8n

Once you learn how to update and delete an assistant, the next step is to add more power with files. With the n8n OpenAI integration, you can use tools like List File, Upload File, and Delete File. These features allow you to attach PDFs, Office files, or notes, so your bots can use them as knowledge sources. Adding files gives your n8n AI automation more context and makes your flows smarter.

*   Explore **List / Upload / Delete File**.
    
*   Attach Office files, PDFs, or notes.
    
*   Use this to improve results in your **n8n workflow automation**.
    

  

## Summary/Quick Notes

  

### 1\. Update Name & Instructions in n8n

#### Step 1: Get the ID

*   Open your **n8n workflow**.
    
*   Copy or note the **unique Assistant ID** generated when you first created it. _This ID is required for any update or deletion._
    

#### Step 2: Open Update Assistant

*   Search for **Update Assistant** under **OpenAI nodes**.
    
*   Select your OpenAI account and paste the ID.
    

#### Step 3: Rename the Assistant

*   In the **Name field**, replace the old name with the new one.
    
*   Example: change **"mood-based movie recommender"** → **"Mood Movie Bot."**
    
*   Click **Execute Step** to apply changes.
    

#### Step 4: Update Instructions

*   In the **Instructions field**, refine the role.
    
*   Example:
    
    *   Before: "Recommend movies based on user mood."
        
    *   After: "Recommend Indian movies based on the mood of the user given via input."
        
*   Run the Update to make it active.
    

#### Step 5: Verify Updates

*   Run **List assistants** in n8n → check new name/instructions.
    
*   Or, confirm directly in the **OpenAI dashboard** under **Assistants**.
    

  

### 2\. Create & Delete an Assistant in n8n

#### Create a New Assistant

*   **In the OpenAI dashboard**:
    
    1.  Go to **Assistants** → click **Create Assistant**.
        
    2.  Enter **Name, Role/Instructions, and Model**.
        
    3.  Save → a **new ID** is generated.
        
*   Back in **n8n**, you can select it via the dropdown or paste its ID.
    

#### Delete an Assistant

*   In **n8n**, select **Delete Assistant** under OpenAI nodes.
    
*   Input the **ID** and execute the step.
    
*   Rerun List assistants or refresh the dashboard → it should be gone.
    
*   Any attempt to call it afterward will return an error.
    

**Pro Tip:** n8n doesn't support real folders. To "organize," just rename with **the Update option** or clean up using **Delete an Assistant / Delete File**. This keeps your workspace tidy without folder structures.
